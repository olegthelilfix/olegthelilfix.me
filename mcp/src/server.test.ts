import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';

import { createApp, readConfig, type McpConfig } from './server.js';

const accessToken = 'a'.repeat(48);
let strapiBaseUrl = '';
let mcpBaseUrl = '';
let closeMcp: () => Promise<void>;
const mutations: { body: unknown; method: string; url: string }[] = [];

test('keeps writes disabled and allowed hosts loopback-only by default', () => {
  const config = readConfig({
    MCP_ACCESS_TOKEN: accessToken,
    STRAPI_API_TOKEN: 'strapi-test-token',
    STRAPI_URL: 'http://cms:1337',
  });

  assert.equal(config.writeEnabled, false);
  assert.deepEqual(config.allowedHosts, ['localhost', '127.0.0.1']);
});

const strapi = createServer(async (req, res) => {
  if (req.url === '/_health') {
    res.writeHead(204).end();
    return;
  }
  assert.equal(req.headers.authorization, 'Bearer strapi-test-token');
  if (req.method === 'POST' || req.method === 'PUT') {
    let rawBody = '';
    for await (const chunk of req) rawBody += chunk;
    mutations.push({ body: JSON.parse(rawBody), method: req.method, url: req.url ?? '' });
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ data: [{ documentId: 'abc123', title: 'Test entry' }] }));
});

before(async () => {
  await new Promise<void>((resolve) => strapi.listen(0, '127.0.0.1', resolve));
  const strapiAddress = strapi.address();
  assert(strapiAddress && typeof strapiAddress === 'object');
  strapiBaseUrl = `http://127.0.0.1:${strapiAddress.port}`;

  const config: McpConfig = {
    accessToken,
    allowedHosts: ['127.0.0.1'],
    port: 3001,
    strapiApiToken: 'strapi-test-token',
    strapiUrl: strapiBaseUrl,
    writeEnabled: true,
  };
  const created = createApp(config);
  closeMcp = created.close;
  const mcp = created.app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => mcp.once('listening', resolve));
  const mcpAddress = mcp.address();
  assert(mcpAddress && typeof mcpAddress === 'object');
  mcpBaseUrl = `http://127.0.0.1:${mcpAddress.port}`;
  closeMcp = async () => {
    await created.close();
    await new Promise<void>((resolve, reject) =>
      mcp.close((error) => (error ? reject(error) : resolve()))
    );
  };
});

after(async () => {
  await closeMcp();
  await new Promise<void>((resolve, reject) =>
    strapi.close((error) => (error ? reject(error) : resolve()))
  );
});

test('rejects an unauthenticated MCP request', async () => {
  const response = await fetch(`${mcpBaseUrl}/mcp`, {
    method: 'POST',
    headers: { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  });
  assert.equal(response.status, 401);
});

test('lists tools with a valid bearer token', async () => {
  const response = await fetch(`${mcpBaseUrl}/mcp`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }),
  });
  assert.equal(response.status, 200);
  const responseText = await response.text();
  const payload = responseText.startsWith('event:')
    ? responseText
        .split('\n')
        .find((line) => line.startsWith('data:'))
        ?.slice('data:'.length)
        .trim()
    : responseText;
  assert(payload);
  const body = JSON.parse(payload) as { result?: { tools?: { name: string }[] } };
  assert.deepEqual(
    body.result?.tools?.map((tool) => tool.name),
    [
      'list_content_types',
      'list_entries',
      'get_entry',
      'get_single_type',
      'create_entry',
      'update_entry',
      'update_single_type',
    ]
  );
});

test('reads entries from Strapi without exposing its API token', async () => {
  const response = await fetch(`${mcpBaseUrl}/mcp`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'list_entries', arguments: { contentType: 'articles' } },
    }),
  });
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.match(text, /Test entry/);
  assert.doesNotMatch(text, /strapi-test-token/);
});

test('updates an allowed single-type field', async () => {
  const response = await fetch(`${mcpBaseUrl}/mcp`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'update_single_type',
        arguments: { contentType: 'home', data: { heroTitle: 'Updated home' } },
      },
    }),
  });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Test entry/);
  assert.deepEqual(mutations.at(-1), {
    body: { data: { heroTitle: 'Updated home' } },
    method: 'PUT',
    url: '/api/home',
  });
});

test('rejects unknown fields before calling Strapi', async () => {
  const mutationCount = mutations.length;
  const response = await fetch(`${mcpBaseUrl}/mcp`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'update_entry',
        arguments: {
          contentType: 'articles',
          documentId: 'abc123',
          data: { adminPassword: 'not-allowed' },
        },
      },
    }),
  });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Unsupported fields for articles/);
  assert.equal(mutations.length, mutationCount);
});

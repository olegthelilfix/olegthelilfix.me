const baseUrl = (process.argv[2] ?? process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000")
  .replace(/\/$/, "");

const pagePaths = [
  "/",
  "/cv",
  "/journey",
  "/remember",
  "/articles",
  "/projects",
  "/collections",
  "/collections/vinyl",
  "/collections/postcards",
  "/photos",
  "/hobbies",
  "/now",
];

const failures = [];

async function request(path) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
}

async function waitUntilReady() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const response = await request("/api/health");
      if (response.ok) return;
    } catch {
      // The server may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`${baseUrl}/api/health did not become ready within 30 seconds`);
}

await waitUntilReady();

for (const path of pagePaths) {
  try {
    const response = await request(path);
    const body = await response.text();
    if (response.status !== 200) failures.push(`${path}: expected 200, got ${response.status}`);
    if (!body.includes("<title>")) failures.push(`${path}: response has no <title>`);
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const [path, contentType] of [
  ["/robots.txt", "text/plain"],
  ["/sitemap.xml", "application/xml"],
  ["/manifest.webmanifest", "application/manifest+json"],
]) {
  const response = await request(path);
  if (response.status !== 200) failures.push(`${path}: expected 200, got ${response.status}`);
  if (!response.headers.get("content-type")?.includes(contentType)) {
    failures.push(`${path}: unexpected content-type ${response.headers.get("content-type")}`);
  }
}

const missing = await request("/definitely-missing");
if (missing.status !== 404) failures.push(`/definitely-missing: expected 404, got ${missing.status}`);

const home = await request("/");
const homeHtml = await home.text();
for (const header of [
  "content-security-policy",
  "referrer-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
]) {
  if (!home.headers.has(header)) failures.push(`/: missing security header ${header}`);
}
if (home.headers.has("x-powered-by")) failures.push("/: x-powered-by should be disabled");

const staticAssets = [
  ...new Set(
    [...homeHtml.matchAll(/(?:src|href)="(\/_next\/static\/[^\"]+)"/g)].map(
      (match) => match[1],
    ),
  ),
].slice(0, 5);
if (staticAssets.length === 0) failures.push("/: no Next.js static assets found in HTML");
for (const asset of staticAssets) {
  const response = await request(asset);
  if (response.status !== 200) failures.push(`${asset}: expected 200, got ${response.status}`);
}

if (failures.length > 0) {
  console.error(`Smoke test failed against ${baseUrl}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Smoke test passed: ${pagePaths.length} pages, metadata routes, static assets, 404 and security headers.`,
);

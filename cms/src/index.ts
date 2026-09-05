import type { Core } from '@strapi/strapi';
import {
  recordSeed,
  postcardSeed,
  articleSeed,
  journeySeed,
  projectSeed,
  memorySeed,
  hobbySeed,
  photoSeed,
  nowSeed,
  cvSeed,
  homeSeed,
} from './seed/data';

type DocUID = Parameters<Core.Strapi['documents']>[0];

// Collection types: seeded row-by-row if empty; public gets find + findOne.
const COLLECTION_SEEDS: { uid: string; data: Record<string, unknown>[] }[] = [
  { uid: 'api::record.record', data: recordSeed },
  { uid: 'api::postcard.postcard', data: postcardSeed },
  { uid: 'api::article.article', data: articleSeed },
  { uid: 'api::journey-event.journey-event', data: journeySeed },
  { uid: 'api::project.project', data: projectSeed },
  { uid: 'api::memory.memory', data: memorySeed },
  { uid: 'api::hobby.hobby', data: hobbySeed },
  { uid: 'api::photo.photo', data: photoSeed },
  { uid: 'api::now-entry.now-entry', data: nowSeed },
];

// Single types: one entry, created if absent; public gets find only.
const SINGLE_SEEDS: { uid: string; data: Record<string, unknown> }[] = [
  { uid: 'api::cv.cv', data: cvSeed },
  { uid: 'api::home.home', data: homeSeed },
];

async function seedCollections(strapi: Core.Strapi) {
  for (const { uid, data } of COLLECTION_SEEDS) {
    const docs = strapi.documents(uid as DocUID);
    if ((await docs.count({})) > 0) continue;
    for (const entry of data) await docs.create({ data: entry });
    strapi.log.info(`[seed] created ${data.length} ${uid} entries`);
  }
}

async function seedSingles(strapi: Core.Strapi) {
  for (const { uid, data } of SINGLE_SEEDS) {
    const docs = strapi.documents(uid as DocUID);
    const existing = await docs.findFirst({});
    if (existing) continue;
    await docs.create({ data });
    strapi.log.info(`[seed] created ${uid} single entry`);
  }
}

async function grantPublicRead(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  const actions = [
    ...COLLECTION_SEEDS.flatMap(({ uid }) => [`${uid}.find`, `${uid}.findOne`]),
    ...SINGLE_SEEDS.map(({ uid }) => `${uid}.find`),
  ];

  for (const action of actions) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });
    if (!existing) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });
      strapi.log.info(`[perms] granted public ${action}`);
    }
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedCollections(strapi);
    await seedSingles(strapi);
    await grantPublicRead(strapi);
  },
};

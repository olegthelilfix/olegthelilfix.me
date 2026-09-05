import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::memory.memory', () => ({
  async find(ctx) {
    ctx.query.filters = { $and: [ctx.query.filters ?? {}, { visibility: { $eq: 'public' } }] };
    return super.find(ctx);
  },
  async findOne(ctx) {
    ctx.query.filters = { $and: [ctx.query.filters ?? {}, { visibility: { $eq: 'public' } }] };
    return super.findOne(ctx);
  },
}));

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::postcard.postcard', () => ({
  async find(ctx) {
    ctx.query.filters = { $and: [ctx.query.filters ?? {}, { visibility: { $eq: 'public' } }] };
    return super.find(ctx);
  },
  async findOne(ctx) {
    ctx.query.filters = { $and: [ctx.query.filters ?? {}, { visibility: { $eq: 'public' } }] };
    return super.findOne(ctx);
  },
}));

# Content

This directory is the site's versioned content store. Editing these files and
pushing the commit rebuilds and deploys the affected pages through GitHub
Actions; there is no runtime CMS or database.

## Files

- `home.ts` - home-page hero, latest item, current project and collage cards.
- `cv.ts` - CV profile and sections.
- `articles.ts`, `projects.ts`, `journey.ts`, `memories.ts` - archive sections.
- `hobbies.ts` - hobbies, the Now page and photo captions.
- `vinyl.ts`, `postcards.ts`, `collections.ts` - collection content.
- `types.ts` - shared content types.

## Editing rules

1. Keep stable `id` values when editing an existing item.
2. Set `visibility` to `public` to render an item. `unlisted` and `private`
   items stay in the repository but are excluded from public pages.
3. Keep facts in this directory and visual layout in `src/`.
4. Run `npm run check` before pushing. TypeScript and the production build
   validate the content structures and render every route.

Every successful push to `master` or `main` deploys the exact built commit
when the repository variable `AUTO_DEPLOY_ENABLED=true`.

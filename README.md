# DOMANI content in the Grace UI

The existing 20-page Grace recreation now uses verified DOMANI product information, official brand assets, perfume photography and source-backed reviews. The original layout and typography are retained, with an interactive 3D packaging showcase.

The packaging showcase displays 50 ml Parfum and ₹1,199 with a single Buy Now link for each fragrance. Each link opens checkout for the matching verified Shopify variant on the official DOMANI store. Payments are handled by the official store.

The black dotted zoom room orbits three packaging cartons and three transparent bottle renders (ALBORI, AZZURO and OBSIDIAN). Carton fronts use the official packaging photographs, clipped onto CSS 3D faces. The bottle renders were generated from the official bottle references; asset paths and generation prompts are recorded in `domani/asset-provenance.json`. The original DOMANI monogram zoom and orbit timeline remain in place, with perspective rotation and hover zoom on the six products.

Run `npm start` and open http://127.0.0.1:4187. Run `npm run check` for asset checks and `npm run build` for the deployable dist directory.

Vercel serves `dist/` as a static site. The build publishes the customized captured bundles under `/_next/static/domani/` and rewrites the HTML and bundle references to match. Keep them out of `/_next/static/immutable/`: their original content hashes no longer match the edited files, which causes Vercel to reject the deployment with `IMMUTABLE_STATIC_HASH_MISMATCH`. Source captures retain their original paths for local development.

The zoom mark uses the official DOMANI vector monogram, fitted to the existing mask and clip-path. Its original scroll animation and orbit scene remain intact. The wordmark and favicon also use the official SVG brand artwork.

Official sources: https://www.domani.in/ and its six product pages, story, FAQ and policies. Current source catalog and asset references are retained under domani/. Captured research and browser evidence are under ignored .captures/.

The cinematic Obsidian hero is generated from official product references using built-in image_gen; the product label and bottle identity were preserved. Its source asset is domani/assets/obsidian-cinematic-hero.png; prompt and provenance are in domani/asset-provenance.json. Motion clips are subtle loops made from the corresponding images to occupy the existing video elements.

Legacy routes and the existing preview calendar are retained. The calendar remains a preview and does not create appointments.

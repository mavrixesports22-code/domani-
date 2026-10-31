# DOMANI content in the Grace UI

The existing 20-page Grace recreation now uses verified DOMANI product information, official brand assets, perfume photography and source-backed reviews. The original CSS, layout, typography and motion timelines are retained. No cart, checkout or additional product flow has been added.

Run `npm start` and open http://127.0.0.1:4187. Run `npm run check` for asset checks and `npm run build` for the deployable dist directory.

The zoom mark uses the official DOMANI vector monogram, fitted to the existing mask and clip-path. Its original scroll animation and orbit scene remain intact. The wordmark and favicon also use the official SVG brand artwork.

Official sources: https://www.domani.in/ and its six product pages, story, FAQ and policies. Current source catalog and asset references are retained under domani/. Captured research and browser evidence are under ignored .captures/.

The cinematic Obsidian hero is generated from official product references using built-in image_gen; the product label and bottle identity were preserved. Its source asset is domani/assets/obsidian-cinematic-hero.png; prompt and provenance are in domani/asset-provenance.json. Motion clips are subtle loops made from the corresponding images to occupy the existing video elements.

Legacy routes and the existing preview calendar are retained. The calendar remains a preview and does not create appointments.

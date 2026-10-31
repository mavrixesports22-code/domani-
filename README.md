# Grace Fashion recreation

Reconstruction of the public gracefashion.ai site, inspected with REA on October 31, 2026. Twenty pages use the original server-rendered markup, styles, fonts, public photographs, videos, and browser bundles. The recovered browser code runs the original GSAP 3.15 / ScrollTrigger and Motion animations.

Run `npm start` and open http://127.0.0.1:4187. No dependency installation is required. Serve at the domain root; direct file:// loading does not support the original absolute asset paths.

Run `npm run check` to verify page and runtime asset references, then `npm run build` to create dist.

local-runtime.js handles static-host navigation, local cookie preferences, and a labeled booking preview. The calendar generates sample weekday slots; submitting does not send data or create an appointment. Its live-calendar link opens the original scheduling service. Reference analytics are disabled.

The original hero video is included as video.mp4. Motion includes the three-part introduction, scroll-driven pixel grid, hero scaling and blur, sticky campaign stack, 40× doorway zoom, 64-second orbit room, product demos, horizontal feature rail, eight-second testimonial rotation, and mobile navigation.

.captures/asset-inventory.json records downloads. .captures/verification.json records browser QA. Raw investigation material is excluded from deployment. Legacy clone-ui.js and clone-ui.css are retained for reference and are not loaded or deployed.

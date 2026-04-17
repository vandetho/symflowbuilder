# Changelog

## [1.8.0](https://github.com/vandetho/symflowbuilder/compare/symflowbuilder-v1.7.0...symflowbuilder-v1.8.0) (2026-04-17)


### Features

* add keyboard shortcuts dialog to editor controls ([afd3d8e](https://github.com/vandetho/symflowbuilder/commit/afd3d8ea6b74715bce3b2d8139e5e6d038b02d85))
* add PM2 config and switch deployment from systemd to PM2 ([e98e25f](https://github.com/vandetho/symflowbuilder/commit/e98e25f7366bd8492a8bc5e2a5ff2b9b131865ce))
* add public explore page for browsing shared workflows ([7b56dfa](https://github.com/vandetho/symflowbuilder/commit/7b56dfa1f85f2c85408491284b870f5a671f4128))
* add sponsor logos, auto-approve workflow, and align deploy secrets ([32cca22](https://github.com/vandetho/symflowbuilder/commit/32cca22b1dde82f0fa9db73cb7cd768838623310))
* add SupportDock feedback FAB and sponsor attribution ([ad3aec8](https://github.com/vandetho/symflowbuilder/commit/ad3aec8299ee7b009ee5bdf804ab8d65ff375174))
* add VPS deployment config, logo, and favicon ([a853d4b](https://github.com/vandetho/symflowbuilder/commit/a853d4b4927a39feb16365e03ecc0c73d2e64db5))
* add zoom in/out and clear canvas buttons to editor controls ([fe0ac22](https://github.com/vandetho/symflowbuilder/commit/fe0ac225e36674c3d04a5c899d26497ac83f795e))
* allow linking additional OAuth providers in settings ([9c8e7c2](https://github.com/vandetho/symflowbuilder/commit/9c8e7c29f469c56e45f2e5fa285a45cb3965db19))
* complete rebuild with visual editor, dark glassmorphism UI, and full-stack architecture ([b10319f](https://github.com/vandetho/symflowbuilder/commit/b10319ff0de548491842739dec9a91717fbd212c))
* dashboard overhaul, save/share workflow, settings, and editor fixes ([d47fdd9](https://github.com/vandetho/symflowbuilder/commit/d47fdd9a4fb0c8a8ae7ed82bfef6b38b810c5323))
* logo, PWA, deploy pipeline, enhanced feedback FAB, zoom percentage ([3a5d750](https://github.com/vandetho/symflowbuilder/commit/3a5d7508891c1256943002731d4b9bf64e79bfad))
* major editor UX overhaul — context menu, auto-layout, custom selects, unique names ([97fe32d](https://github.com/vandetho/symflowbuilder/commit/97fe32d93d32a729b4e3343e6747e6d2e4c704e4))
* private sharing, FAQ page, UI polish, and auth fix ([8c2bc40](https://github.com/vandetho/symflowbuilder/commit/8c2bc401c650110826b17dee79ae7bd035dee9ba))
* redesign landing page as workflow flow, expand documentation ([2bd848b](https://github.com/vandetho/symflowbuilder/commit/2bd848b179055e4cd134e19402c94ab830d67092))
* TanStack Hotkeys, SEO improvements, and fix auto-approve for release-please ([5238160](https://github.com/vandetho/symflowbuilder/commit/52381605c44cbd49e45127be64aae5c0b158bd1f))
* upgrade Prisma to v7 and default Symfony version to 8.0 ([2c8913d](https://github.com/vandetho/symflowbuilder/commit/2c8913ddbd31154b4b72f0380cd97fcb7b5a220b))


### Bug Fixes

* add AUTH_TRUST_HOST=true for self-hosted Auth.js ([047e2b8](https://github.com/vandetho/symflowbuilder/commit/047e2b8da33d570c8da1f208ad7e91ce383e8953))
* add AUTH_URL to .env.production template for Auth.js in production ([5fa89fb](https://github.com/vandetho/symflowbuilder/commit/5fa89fbbaac4deec1b2b0cb774db718276d9d156))
* add back-to-home link on sign-in page ([02b7aea](https://github.com/vandetho/symflowbuilder/commit/02b7aea5b469da29c904c4ff61455cdac6797f5e))
* clean node_modules and fix ownership in setup script, update nginx for HTTP/3 ([0ec508b](https://github.com/vandetho/symflowbuilder/commit/0ec508be21d00ffad64545ac6ffd139839323450))
* create .pm2 directory with correct ownership in setup script ([3374e07](https://github.com/vandetho/symflowbuilder/commit/3374e074a374d53dba2b5050100dd3ad0392fe5d))
* deploy on release only, gate releases behind CI, switch to debian user ([54a3010](https://github.com/vandetho/symflowbuilder/commit/54a3010f5a7540e66238fe948b7d627f30318cfb))
* disable PKCE for GitHub OAuth — use state check only ([b49d1e7](https://github.com/vandetho/symflowbuilder/commit/b49d1e7e82cf893810135df803654b014ab91383))
* hardcode GitHub App ID — secrets resolution failing ([4803c5f](https://github.com/vandetho/symflowbuilder/commit/4803c5fee0c82baa7e2f0d560d10bc4b9d3b77b4))
* hide create workflow for guests, fix DailyBrew URL, auto-merge releases ([ded1b7d](https://github.com/vandetho/symflowbuilder/commit/ded1b7d89c69c2737b29713a0a1fcd5c1dd8ec89))
* hide minimap when properties panel is open ([dfaf69c](https://github.com/vandetho/symflowbuilder/commit/dfaf69c06ecb6f025df24536206ec923d35162a9))
* make prisma.config.ts work in CI without DATABASE_URL ([068e8d2](https://github.com/vandetho/symflowbuilder/commit/068e8d2e6a3e76497203cdd3aa7118c267a23de9))
* make sitemap dynamic and handle missing DB in CI ([f1eb13b](https://github.com/vandetho/symflowbuilder/commit/f1eb13bd538e38cf1f77414ffecb4212d1db216b))
* make transition labels and edges easier to click ([7a0ee03](https://github.com/vandetho/symflowbuilder/commit/7a0ee03b067fffd75a9fdb0dc2fbe65a597ddb02))
* migrate middleware to proxy, prompt for DB password, and show dashboard when signed in ([b5fdff3](https://github.com/vandetho/symflowbuilder/commit/b5fdff3bd15d0aa54d76ed23c0b08e0620e4edab))
* move node palette below toolbar, improve minimap visibility ([d8d429b](https://github.com/vandetho/symflowbuilder/commit/d8d429b2b4de3a3c929cdb927548eba0b3575e5b))
* prevent duplicate CI/Release runs and update auto-approve workflow ([6a769e2](https://github.com/vandetho/symflowbuilder/commit/6a769e210ec35a6e5defcc8c4ea8d83fa210cfa2))
* remove changelog-types from workflow — use release-please-config.json ([4ac7e3c](https://github.com/vandetho/symflowbuilder/commit/4ac7e3c95c11dd64f09cba0ff028f6c3b28e4132))
* restore Prisma 7 and adapter-pg in package.json ([c0e4951](https://github.com/vandetho/symflowbuilder/commit/c0e49510f48c532771c2a3af0278aef805cf3cf3))
* revert palette text color, fix all eslint and tsc errors ([348248f](https://github.com/vandetho/symflowbuilder/commit/348248fbf15e64f03cd29dc11e5d14f52e1eea10))
* set PKCE cookie domain to .symflowbuilder.com for cross-browser support ([2c6176c](https://github.com/vandetho/symflowbuilder/commit/2c6176c6dd015d38a4317aa4991804d1bf86b453))
* set PM2_HOME to debian user home in deploy script ([51684be](https://github.com/vandetho/symflowbuilder/commit/51684be5412d54b7fff3ff64152f9cb4715ee62f))
* transition label click now properly selects the edge ([48a4a8d](https://github.com/vandetho/symflowbuilder/commit/48a4a8d776fcb85d1c4ab7bd14fa17668b0c003e))
* update Symfony versions to current releases (5.4, 6.4, 7.4, 8.0) ([6488b3f](https://github.com/vandetho/symflowbuilder/commit/6488b3fcda7e55dfeb01dae6e0e022422ac9671d))
* use fork mode in PM2 config — cluster mode breaks Next.js ([e781388](https://github.com/vandetho/symflowbuilder/commit/e781388faef87af74823d1ed97c170de978121fd))
* use GITHUB_TOKEN for release-please instead of app token ([86f92a8](https://github.com/vandetho/symflowbuilder/commit/86f92a8a7960f93932b0e59959cf30fee5dd1e5a))
* use Production environment for release-please to access secrets ([7f2c1db](https://github.com/vandetho/symflowbuilder/commit/7f2c1dbc30f30148b4becb88b79935a8f0f61c07))
* use secrets.BOT_APP_ID instead of vars — vars not available in all contexts ([415b4df](https://github.com/vandetho/symflowbuilder/commit/415b4dfb2343b76e4763c6a02cad211e4574b9b0))


### Refactoring

* consolidate CI and release into single workflow ([4ad9280](https://github.com/vandetho/symflowbuilder/commit/4ad92809ec7bffb4293cce8deaf19a3769cef3ef))
* remove separate Initial/Final node types, enhance transition properties ([870d022](https://github.com/vandetho/symflowbuilder/commit/870d0224c411dacb05b27e10e9908eb0fbbced85))


### Documentation

* add ERM and architecture diagrams with Mermaid, add roadmap to README ([3468643](https://github.com/vandetho/symflowbuilder/commit/3468643e4c4afe38c61f44dce2b59e1aefd738db))
* add SupportDock sponsor section to README ([2770b7c](https://github.com/vandetho/symflowbuilder/commit/2770b7c632e685f9c3499a5c1c27d8f7b919e68c))
* rewrite README for the rebuilt project ([cd0d55b](https://github.com/vandetho/symflowbuilder/commit/cd0d55b578264c746e82a4b834c325245d959c42))
* update DailyBrew description in README ([72cafbd](https://github.com/vandetho/symflowbuilder/commit/72cafbdc32d80996ae764b6dc26e20b44120f263))

## [1.7.0](https://github.com/vandetho/symflowbuilder/compare/v1.6.2...v1.7.0) (2026-04-16)


### Features

* TanStack Hotkeys, SEO improvements, and fix auto-approve for release-please ([5238160](https://github.com/vandetho/symflowbuilder/commit/52381605c44cbd49e45127be64aae5c0b158bd1f))


### Bug Fixes

* make sitemap dynamic and handle missing DB in CI ([f1eb13b](https://github.com/vandetho/symflowbuilder/commit/f1eb13bd538e38cf1f77414ffecb4212d1db216b))
* set PKCE cookie domain to .symflowbuilder.com for cross-browser support ([2c6176c](https://github.com/vandetho/symflowbuilder/commit/2c6176c6dd015d38a4317aa4991804d1bf86b453))

## [1.6.2](https://github.com/vandetho/symflowbuilder/compare/v1.6.1...v1.6.2) (2026-04-16)


### Bug Fixes

* make prisma.config.ts work in CI without DATABASE_URL ([068e8d2](https://github.com/vandetho/symflowbuilder/commit/068e8d2e6a3e76497203cdd3aa7118c267a23de9))
* restore Prisma 7 and adapter-pg in package.json ([c0e4951](https://github.com/vandetho/symflowbuilder/commit/c0e49510f48c532771c2a3af0278aef805cf3cf3))

## [1.6.1](https://github.com/vandetho/symflowbuilder/compare/v1.6.0...v1.6.1) (2026-04-16)


### Bug Fixes

* prevent duplicate CI/Release runs and update auto-approve workflow ([6a769e2](https://github.com/vandetho/symflowbuilder/commit/6a769e210ec35a6e5defcc8c4ea8d83fa210cfa2))

## [1.6.0](https://github.com/vandetho/symflowbuilder/compare/v1.5.0...v1.6.0) (2026-04-16)


### Features

* private sharing, FAQ page, UI polish, and auth fix ([8c2bc40](https://github.com/vandetho/symflowbuilder/commit/8c2bc401c650110826b17dee79ae7bd035dee9ba))

## [1.5.0](https://github.com/vandetho/symflowbuilder/compare/v1.4.0...v1.5.0) (2026-04-16)


### Features

* upgrade Prisma to v7 and default Symfony version to 8.0 ([2c8913d](https://github.com/vandetho/symflowbuilder/commit/2c8913ddbd31154b4b72f0380cd97fcb7b5a220b))


### Bug Fixes

* deploy on release only, gate releases behind CI, switch to debian user ([54a3010](https://github.com/vandetho/symflowbuilder/commit/54a3010f5a7540e66238fe948b7d627f30318cfb))
* set PM2_HOME to debian user home in deploy script ([51684be](https://github.com/vandetho/symflowbuilder/commit/51684be5412d54b7fff3ff64152f9cb4715ee62f))

## [1.4.0](https://github.com/vandetho/symflowbuilder/compare/v1.3.0...v1.4.0) (2026-04-16)


### Features

* add sponsor logos, auto-approve workflow, and align deploy secrets ([32cca22](https://github.com/vandetho/symflowbuilder/commit/32cca22b1dde82f0fa9db73cb7cd768838623310))

## [1.3.0](https://github.com/vandetho/symflowbuilder/compare/v1.2.0...v1.3.0) (2026-04-16)


### Features

* add public explore page for browsing shared workflows ([7b56dfa](https://github.com/vandetho/symflowbuilder/commit/7b56dfa1f85f2c85408491284b870f5a671f4128))

## [1.2.0](https://github.com/vandetho/symflowbuilder/compare/v1.1.0...v1.2.0) (2026-04-15)

### Features

- add PM2 config and switch deployment from systemd to PM2 ([e98e25f](https://github.com/vandetho/symflowbuilder/commit/e98e25f7366bd8492a8bc5e2a5ff2b9b131865ce))

### Bug Fixes

- add AUTH_TRUST_HOST=true for self-hosted Auth.js ([047e2b8](https://github.com/vandetho/symflowbuilder/commit/047e2b8da33d570c8da1f208ad7e91ce383e8953))
- add AUTH_URL to .env.production template for Auth.js in production ([5fa89fb](https://github.com/vandetho/symflowbuilder/commit/5fa89fbbaac4deec1b2b0cb774db718276d9d156))
- clean node_modules and fix ownership in setup script, update nginx for HTTP/3 ([0ec508b](https://github.com/vandetho/symflowbuilder/commit/0ec508be21d00ffad64545ac6ffd139839323450))
- create .pm2 directory with correct ownership in setup script ([3374e07](https://github.com/vandetho/symflowbuilder/commit/3374e074a374d53dba2b5050100dd3ad0392fe5d))
- migrate middleware to proxy, prompt for DB password, and show dashboard when signed in ([b5fdff3](https://github.com/vandetho/symflowbuilder/commit/b5fdff3bd15d0aa54d76ed23c0b08e0620e4edab))
- use fork mode in PM2 config — cluster mode breaks Next.js ([e781388](https://github.com/vandetho/symflowbuilder/commit/e781388faef87af74823d1ed97c170de978121fd))

## [1.1.0](https://github.com/vandetho/symflowbuilder/compare/v1.0.0...v1.1.0) (2026-04-15)

### Features

- dashboard overhaul, save/share workflow, settings, and editor fixes ([d47fdd9](https://github.com/vandetho/symflowbuilder/commit/d47fdd9a4fb0c8a8ae7ed82bfef6b38b810c5323))
- major editor UX overhaul — context menu, auto-layout, custom selects, unique names ([97fe32d](https://github.com/vandetho/symflowbuilder/commit/97fe32d93d32a729b4e3343e6747e6d2e4c704e4))

### Bug Fixes

- add back-to-home link on sign-in page ([02b7aea](https://github.com/vandetho/symflowbuilder/commit/02b7aea5b469da29c904c4ff61455cdac6797f5e))
- hide minimap when properties panel is open ([dfaf69c](https://github.com/vandetho/symflowbuilder/commit/dfaf69c06ecb6f025df24536206ec923d35162a9))

## 1.0.0 (2026-04-14)

### Features

- add keyboard shortcuts dialog to editor controls ([afd3d8e](https://github.com/vandetho/symflowbuilder/commit/afd3d8ea6b74715bce3b2d8139e5e6d038b02d85))
- add SupportDock feedback FAB and sponsor attribution ([ad3aec8](https://github.com/vandetho/symflowbuilder/commit/ad3aec8299ee7b009ee5bdf804ab8d65ff375174))
- add VPS deployment config, logo, and favicon ([a853d4b](https://github.com/vandetho/symflowbuilder/commit/a853d4b4927a39feb16365e03ecc0c73d2e64db5))
- add zoom in/out and clear canvas buttons to editor controls ([fe0ac22](https://github.com/vandetho/symflowbuilder/commit/fe0ac225e36674c3d04a5c899d26497ac83f795e))
- complete rebuild with visual editor, dark glassmorphism UI, and full-stack architecture ([b10319f](https://github.com/vandetho/symflowbuilder/commit/b10319ff0de548491842739dec9a91717fbd212c))
- logo, PWA, deploy pipeline, enhanced feedback FAB, zoom percentage ([3a5d750](https://github.com/vandetho/symflowbuilder/commit/3a5d7508891c1256943002731d4b9bf64e79bfad))

### Bug Fixes

- make transition labels and edges easier to click ([7a0ee03](https://github.com/vandetho/symflowbuilder/commit/7a0ee03b067fffd75a9fdb0dc2fbe65a597ddb02))
- move node palette below toolbar, improve minimap visibility ([d8d429b](https://github.com/vandetho/symflowbuilder/commit/d8d429b2b4de3a3c929cdb927548eba0b3575e5b))
- revert palette text color, fix all eslint and tsc errors ([348248f](https://github.com/vandetho/symflowbuilder/commit/348248fbf15e64f03cd29dc11e5d14f52e1eea10))
- update Symfony versions to current releases (5.4, 6.4, 7.4, 8.0) ([6488b3f](https://github.com/vandetho/symflowbuilder/commit/6488b3fcda7e55dfeb01dae6e0e022422ac9671d))

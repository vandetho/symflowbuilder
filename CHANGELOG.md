# Changelog

## [1.24.0](https://github.com/vandetho/symflowbuilder/compare/v1.23.3...v1.24.0) (2026-04-20)


### Features

* add optional collab integration point for proprietary package ([711f4ff](https://github.com/vandetho/symflowbuilder/commit/711f4ff06e42ac3d822cf970914c68e31c7609d1))
* expand collab loader with Yjs sync and UI component types ([ac1e1c6](https://github.com/vandetho/symflowbuilder/commit/ac1e1c6d914aafab5aa63a7680d5e00083b6d7f6))


### Bug Fixes

* suppress TS error for optional collab package import ([c6c86ab](https://github.com/vandetho/symflowbuilder/commit/c6c86abe8c05b6a249c6fa4cebec66363e15b350))

## [1.23.3](https://github.com/vandetho/symflowbuilder/compare/v1.23.2...v1.23.3) (2026-04-20)


### Bug Fixes

* switch deploy to pnpm — npm can't handle workspace:* protocol ([cf920d4](https://github.com/vandetho/symflowbuilder/commit/cf920d4cd2e867b8d8884a72d047b031d6641c3e))

## [1.23.2](https://github.com/vandetho/symflowbuilder/compare/v1.23.1...v1.23.2) (2026-04-20)


### Bug Fixes

* resolve CI failures for workspace packages ([7dff316](https://github.com/vandetho/symflowbuilder/commit/7dff316d25b86cbefc302824ea7607baf70f0e91))


### Refactoring

* split framework-agnostic logic into @symflowbuilder/core and @symflowbuilder/db ([57aa913](https://github.com/vandetho/symflowbuilder/commit/57aa913e8ffbb2a739967e217752ccbc8a4b5154))

## [1.23.1](https://github.com/vandetho/symflowbuilder/compare/v1.23.0...v1.23.1) (2026-04-20)


### Bug Fixes

* use pnpm dlx for prisma generate in CI ([4fe13b5](https://github.com/vandetho/symflowbuilder/commit/4fe13b577e3e53345853ca4ce3e34bd7e6663d7f))

## [1.23.0](https://github.com/vandetho/symflowbuilder/compare/v1.22.1...v1.23.0) (2026-04-19)


### Features

* add YAML export and simulator to shared workflow view ([26a9eab](https://github.com/vandetho/symflowbuilder/commit/26a9eab642669878d12b0da48bbf9eae1b4d71e9))


### Bug Fixes

* add Play/Square icons to simulate button in shared view ([49dd91d](https://github.com/vandetho/symflowbuilder/commit/49dd91d7e4cd2da75010cec5b08cde7efccd634f))

## [1.22.1](https://github.com/vandetho/symflowbuilder/compare/v1.22.0...v1.22.1) (2026-04-19)


### Bug Fixes

* remove overflow-x-hidden that breaks sticky navbar on landing page ([5708a4c](https://github.com/vandetho/symflowbuilder/commit/5708a4ce8151b8a2ed2227bdda64e3310c21bb5d))

## [1.22.0](https://github.com/vandetho/symflowbuilder/compare/v1.21.2...v1.22.0) (2026-04-19)


### Features

* add Config dialog to shared workflow view ([e5e66ff](https://github.com/vandetho/symflowbuilder/commit/e5e66ff21d0db83ff3a21e9fde63692f8d897ea9))

## [1.21.2](https://github.com/vandetho/symflowbuilder/compare/v1.21.1...v1.21.2) (2026-04-19)


### Bug Fixes

* make landing page navbar sticky on scroll ([aa2d6a9](https://github.com/vandetho/symflowbuilder/commit/aa2d6a9818ced662d2f42c417bf8700fad148ae0))

## [1.21.1](https://github.com/vandetho/symflowbuilder/compare/v1.21.0...v1.21.1) (2026-04-19)


### Bug Fixes

* register TransitionNode and ConnectorEdge in shared workflow view ([978867a](https://github.com/vandetho/symflowbuilder/commit/978867a8958599eca25387ebdc8c2c7be19ff4bf))

## [1.21.0](https://github.com/vandetho/symflowbuilder/compare/v1.20.2...v1.21.0) (2026-04-19)


### Features

* add mobile hamburger menu with glass slide-over panel ([3f82db7](https://github.com/vandetho/symflowbuilder/commit/3f82db7c1ebd9a9d7f39e959628672c04e349b8a))

## [1.20.2](https://github.com/vandetho/symflowbuilder/compare/v1.20.1...v1.20.2) (2026-04-19)


### Refactoring

* extract Footer component, navbar sticky only on subpages ([0ff741d](https://github.com/vandetho/symflowbuilder/commit/0ff741dead47cdc38db5dc4f388eff57d43bc6c0))

## [1.20.1](https://github.com/vandetho/symflowbuilder/compare/v1.20.0...v1.20.1) (2026-04-19)


### Refactoring

* extract shared Navbar component from 6 pages ([1b6130a](https://github.com/vandetho/symflowbuilder/commit/1b6130aaad06e33914140d3ff6addad1440a1206))

## [1.20.0](https://github.com/vandetho/symflowbuilder/compare/v1.19.1...v1.20.0) (2026-04-19)


### Features

* fix engine event order to match Symfony, add docs, update navbars ([eef4262](https://github.com/vandetho/symflowbuilder/commit/eef426248833d3aee626a54253f5e6d6a6c17803))


### Bug Fixes

* use glass-strong for all page navbars ([de516d5](https://github.com/vandetho/symflowbuilder/commit/de516d594802ae68e3704411683b9e91d1317a7f))

## [1.19.1](https://github.com/vandetho/symflowbuilder/compare/v1.19.0...v1.19.1) (2026-04-19)


### Documentation

* update landing, features, how-it-works, and blog with guard/event features ([7734bf2](https://github.com/vandetho/symflowbuilder/commit/7734bf22eaabf58144020f47785a99bfae865960))
* update README with workflow engine and guard toggle features ([0484aa9](https://github.com/vandetho/symflowbuilder/commit/0484aa98c0a26822e508871265edb9017f7d590a))

## [1.19.0](https://github.com/vandetho/symflowbuilder/compare/v1.18.0...v1.19.0) (2026-04-19)


### Features

* add guard toggles and event log to simulator ([3b9062f](https://github.com/vandetho/symflowbuilder/commit/3b9062fc9d7c9f802dd2f893fd17a52f50005936))

## [1.18.0](https://github.com/vandetho/symflowbuilder/compare/v1.17.0...v1.18.0) (2026-04-19)


### Features

* add Explore button to editor toolbar ([1ea11b7](https://github.com/vandetho/symflowbuilder/commit/1ea11b76cefc9bff951601f8885555ec9c17c353))

## [1.17.0](https://github.com/vandetho/symflowbuilder/compare/v1.16.5...v1.17.0) (2026-04-19)


### Features

* add Features, How It Works, and Blog pages ([cfb9ea4](https://github.com/vandetho/symflowbuilder/commit/cfb9ea4e204fb5e9664340ca59f8534182b38183))

## [1.16.5](https://github.com/vandetho/symflowbuilder/compare/v1.16.4...v1.16.5) (2026-04-19)


### Bug Fixes

* show share tooltip below the toolbar button ([c7eb2bc](https://github.com/vandetho/symflowbuilder/commit/c7eb2bc6986b9bfb0c445d69f04d66a648cd4806))

## [1.16.4](https://github.com/vandetho/symflowbuilder/compare/v1.16.3...v1.16.4) (2026-04-17)


### Documentation

* update landing page and README with new features ([09b0ac1](https://github.com/vandetho/symflowbuilder/commit/09b0ac11189d2902a78ccf42ddb2cd737314ed38))

## [1.16.3](https://github.com/vandetho/symflowbuilder/compare/v1.16.2...v1.16.3) (2026-04-17)


### Bug Fixes

* add tooltip to Share button explaining its action ([ee98e9d](https://github.com/vandetho/symflowbuilder/commit/ee98e9d52c80f4249290d42fbe7df835b32ef105))

## [1.16.2](https://github.com/vandetho/symflowbuilder/compare/v1.16.1...v1.16.2) (2026-04-17)


### Bug Fixes

* add migration for old edge-based workflows and improve share feedback ([50b03ad](https://github.com/vandetho/symflowbuilder/commit/50b03ad3244a01f77a2a33527552747e01d8c09d))

## [1.16.1](https://github.com/vandetho/symflowbuilder/compare/v1.16.0...v1.16.1) (2026-04-17)


### Bug Fixes

* deduplicate from/to labels in transition properties panel ([4d39901](https://github.com/vandetho/symflowbuilder/commit/4d39901701e134c8d0398ddc3fe74a88974b8be9))

## [1.16.0](https://github.com/vandetho/symflowbuilder/compare/v1.15.1...v1.16.0) (2026-04-17)


### Features

* refactor transitions from edges to nodes (Petri-net model) ([46c9fbd](https://github.com/vandetho/symflowbuilder/commit/46c9fbd2582ddabd6acecdaa3af954c099f81a84))

## [1.15.1](https://github.com/vandetho/symflowbuilder/compare/v1.15.0...v1.15.1) (2026-04-17)


### Bug Fixes

* visually distinguish AND edges with solid accent lines ([9255a22](https://github.com/vandetho/symflowbuilder/commit/9255a22ff494ee11ff0d00436bd8b6153ed410ae))

## [1.15.0](https://github.com/vandetho/symflowbuilder/compare/v1.14.2...v1.15.0) (2026-04-17)


### Features

* always show AND/FORK badges on edges, not just during simulation ([51b1cef](https://github.com/vandetho/symflowbuilder/commit/51b1cefe7c66c225f087e4d2393a13f849c33298))

## [1.14.2](https://github.com/vandetho/symflowbuilder/compare/v1.14.1...v1.14.2) (2026-04-17)


### Bug Fixes

* distinguish XOR vs OR patterns based on workflow type ([b135fd1](https://github.com/vandetho/symflowbuilder/commit/b135fd1b404f8ac86f7de591446d1691fd2dcf10))

## [1.14.1](https://github.com/vandetho/symflowbuilder/compare/v1.14.0...v1.14.1) (2026-04-17)


### Bug Fixes

* correct pattern labels — OR not XOR for multi-transition places ([68bb02a](https://github.com/vandetho/symflowbuilder/commit/68bb02a754b94027b7e596b9d646e552eb84de2b))

## [1.14.0](https://github.com/vandetho/symflowbuilder/compare/v1.13.3...v1.14.0) (2026-04-17)


### Features

* detect AND/OR/XOR workflow patterns in simulator ([274884b](https://github.com/vandetho/symflowbuilder/commit/274884b1fa222f2ab7a5f4bf4f8f91b021d12aa0))

## [1.13.3](https://github.com/vandetho/symflowbuilder/compare/v1.13.2...v1.13.3) (2026-04-17)


### Bug Fixes

* auto-detect dropdown direction in Select to avoid bottom overlap ([b0a57f5](https://github.com/vandetho/symflowbuilder/commit/b0a57f50fc73ade07a0f661c3e908ee77ffc7034))
* constrain logo size in README ([6d23f36](https://github.com/vandetho/symflowbuilder/commit/6d23f36840a81c689d38f226f39716bde8858053))

## [1.13.2](https://github.com/vandetho/symflowbuilder/compare/v1.13.1...v1.13.2) (2026-04-17)


### Bug Fixes

* remove deprecated align attribute from README header ([944a9b4](https://github.com/vandetho/symflowbuilder/commit/944a9b4c8b54a4bafeef827a0b96f536e6bfb688))

## [1.13.1](https://github.com/vandetho/symflowbuilder/compare/v1.13.0...v1.13.1) (2026-04-17)


### Documentation

* simplify CLAUDE.md, split reference docs into docs/ ([6c7ca83](https://github.com/vandetho/symflowbuilder/commit/6c7ca833ddf0d5b997300bacb951ada309402e4c))

## [1.13.0](https://github.com/vandetho/symflowbuilder/compare/v1.12.4...v1.13.0) (2026-04-17)


### Features

* add workflow engine and visual simulator ([ed4b2d2](https://github.com/vandetho/symflowbuilder/commit/ed4b2d2c0f372765db986fdbd51ce685d104844b))

## [1.12.4](https://github.com/vandetho/symflowbuilder/compare/v1.12.3...v1.12.4) (2026-04-17)


### Bug Fixes

* revert deploy to npm — server lacks pnpm permissions ([16e3c74](https://github.com/vandetho/symflowbuilder/commit/16e3c74898ebfcfb9e7160e9f4fb80df8cfceafe))

## [1.12.3](https://github.com/vandetho/symflowbuilder/compare/v1.12.2...v1.12.3) (2026-04-17)


### Bug Fixes

* install pnpm to user prefix to avoid permission errors ([de2706d](https://github.com/vandetho/symflowbuilder/commit/de2706da9965bc1896ede5b95c98490a5ae924ca))

## [1.12.2](https://github.com/vandetho/symflowbuilder/compare/v1.12.1...v1.12.2) (2026-04-17)


### Bug Fixes

* disable corepack and force direct pnpm install in deploy ([1e41d98](https://github.com/vandetho/symflowbuilder/commit/1e41d983e22ca99ae0d20dc30c00a654a1832168))

## [1.12.1](https://github.com/vandetho/symflowbuilder/compare/v1.12.0...v1.12.1) (2026-04-17)


### Bug Fixes

* install pnpm in deploy script to avoid corepack signature error ([388aaaf](https://github.com/vandetho/symflowbuilder/commit/388aaafc46515e8c12cb2ed00c85c69d18fcd526))

## [1.12.0](https://github.com/vandetho/symflowbuilder/compare/v1.11.0...v1.12.0) (2026-04-17)


### Features

* always show Share button, migrate CI/CD to pnpm ([b98d5ff](https://github.com/vandetho/symflowbuilder/commit/b98d5ff3520b4c8c49e05a61f357a8ac61656ea2))


### Bug Fixes

* add packageManager field for pnpm/action-setup ([aea1375](https://github.com/vandetho/symflowbuilder/commit/aea137567cfda12f1ce5d9b3623f9a33ceb37272))
* resolve react-hooks/set-state-in-effect lint errors ([919d903](https://github.com/vandetho/symflowbuilder/commit/919d903fc4fd668b51430a0c3c406c2beabf6c7d))

## [1.11.0](https://github.com/vandetho/symflowbuilder/compare/v1.10.4...v1.11.0) (2026-04-17)


### Features

* add Radix Checkbox and RadioGroup, enforce no-native-HTML rule ([b367d06](https://github.com/vandetho/symflowbuilder/commit/b367d06ac03b633b93af331c4b262a6405d9a9e1))
* add react-color picker for styling metadata fields ([04711ab](https://github.com/vandetho/symflowbuilder/commit/04711ab85d799b9acebe76bee52044b0bef0f5ee))
* add version badge with GitHub link to editor toolbar ([3a5f8ae](https://github.com/vandetho/symflowbuilder/commit/3a5f8aec37eef2cfc01c9a52f2a93b546a95b5ab))


### Bug Fixes

* remove arrowhead marker from transition edges ([aa9cac6](https://github.com/vandetho/symflowbuilder/commit/aa9cac60b710e3f0d6a26ca897a2047a456602fc))
* sync package-lock.json with new dependencies ([0add265](https://github.com/vandetho/symflowbuilder/commit/0add265b292f9a1d0046833d6476cf894ea0281b))

## [1.10.4](https://github.com/vandetho/symflowbuilder/compare/v1.10.3...v1.10.4) (2026-04-17)


### Bug Fixes

* use inline styles for edge colors and remove native color pickers ([439e2c5](https://github.com/vandetho/symflowbuilder/commit/439e2c5a4dfbc31a3cfee8a29f373f692690b88b))

## [1.10.3](https://github.com/vandetho/symflowbuilder/compare/v1.10.2...v1.10.3) (2026-04-17)


### Bug Fixes

* apply color to transition label and arrow_color to edge line ([91ba839](https://github.com/vandetho/symflowbuilder/commit/91ba8395c036ecb419dc17e12183eaac7a2731fd))

## [1.10.2](https://github.com/vandetho/symflowbuilder/compare/v1.10.1...v1.10.2) (2026-04-17)


### Bug Fixes

* enlarge landing page workflow preview and fix width collapse ([638a64a](https://github.com/vandetho/symflowbuilder/commit/638a64ae85a036f1117f804a4b96df7fea5c1a5c))

## [1.10.1](https://github.com/vandetho/symflowbuilder/compare/v1.10.0...v1.10.1) (2026-04-17)


### Bug Fixes

* match Symfony YAML conventions — tilde nulls, flow arrays, scalar initial_marking ([5121db6](https://github.com/vandetho/symflowbuilder/commit/5121db6cf854ddd0138ebfc377c0c96de6e802e1))

## [1.10.0](https://github.com/vandetho/symflowbuilder/compare/v1.9.1...v1.10.0) (2026-04-17)


### Features

* add Symfony styling metadata support and enlarge landing preview ([35af59c](https://github.com/vandetho/symflowbuilder/commit/35af59c035881f63055236a287d9f25a1f54ceba))

## [1.9.1](https://github.com/vandetho/symflowbuilder/compare/v1.9.0...v1.9.1) (2026-04-17)


### Bug Fixes

* swap tokens — app creates PR, GITHUB_TOKEN approves, app merges ([c92997a](https://github.com/vandetho/symflowbuilder/commit/c92997a4203675a69cc2a705bd884d121a6f79fa))

## [1.9.0](https://github.com/vandetho/symflowbuilder/compare/v1.8.1...v1.9.0) (2026-04-17)


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
* GITHUB_TOKEN creates PR, app token approves — can't approve own PR ([957b5dd](https://github.com/vandetho/symflowbuilder/commit/957b5ddb5a38083594cadb25802c16f3f1f2fab1))
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
* remove component name from release tags ([a3116c3](https://github.com/vandetho/symflowbuilder/commit/a3116c3b54d48e4c5411a1a808bfb62d942068d7))
* restore Prisma 7 and adapter-pg in package.json ([c0e4951](https://github.com/vandetho/symflowbuilder/commit/c0e49510f48c532771c2a3af0278aef805cf3cf3))
* revert palette text color, fix all eslint and tsc errors ([348248f](https://github.com/vandetho/symflowbuilder/commit/348248fbf15e64f03cd29dc11e5d14f52e1eea10))
* set PKCE cookie domain to .symflowbuilder.com for cross-browser support ([2c6176c](https://github.com/vandetho/symflowbuilder/commit/2c6176c6dd015d38a4317aa4991804d1bf86b453))
* set PM2_HOME to debian user home in deploy script ([51684be](https://github.com/vandetho/symflowbuilder/commit/51684be5412d54b7fff3ff64152f9cb4715ee62f))
* transition label click now properly selects the edge ([48a4a8d](https://github.com/vandetho/symflowbuilder/commit/48a4a8d776fcb85d1c4ab7bd14fa17668b0c003e))
* update Symfony versions to current releases (5.4, 6.4, 7.4, 8.0) ([6488b3f](https://github.com/vandetho/symflowbuilder/commit/6488b3fcda7e55dfeb01dae6e0e022422ac9671d))
* use app token for release-please to update labels after release ([bb965ff](https://github.com/vandetho/symflowbuilder/commit/bb965ff5bc82f62e358ac9e1ed05f0e9e13d0677))
* use app token to approve and auto-merge release PRs ([02d3392](https://github.com/vandetho/symflowbuilder/commit/02d3392d427a0fb21e78716e9f3d5dea5c8f8716))
* use fork mode in PM2 config — cluster mode breaks Next.js ([e781388](https://github.com/vandetho/symflowbuilder/commit/e781388faef87af74823d1ed97c170de978121fd))
* use GITHUB_TOKEN for PR merge, app token for approve only ([41a4873](https://github.com/vandetho/symflowbuilder/commit/41a4873cb0cb73263cdd81554921e1761d780f3c))
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

## [1.8.1](https://github.com/vandetho/symflowbuilder/compare/symflowbuilder-v1.8.0...symflowbuilder-v1.8.1) (2026-04-17)


### Bug Fixes

* use app token to approve and auto-merge release PRs ([02d3392](https://github.com/vandetho/symflowbuilder/commit/02d3392d427a0fb21e78716e9f3d5dea5c8f8716))

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

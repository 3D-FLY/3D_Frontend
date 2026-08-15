# Progress log

> Append-only work log. New entries go at the BOTTOM via append — do not
> rewrite history. Decisions/architecture live in ARCHITECTURE-SUMMARY.md.

## 2026-08-14 — Architecture decided

- Product framing locked from "MVP Scope Summary for Raz v0.1": Shopify only,
  FDM only, vetted partners, basic routing, manual admin intervention allowed.
- Architecture: Java 21 / Spring Boot 3.5 **modular monolith** (7 domain
  modules + common), NOT microservices. Two ECS Fargate services from one
  Docker image: `3dfly-api` (HTTP) + `3dfly-worker` (queue jobs). One Postgres.
  Monorepo, NOT multi-repo.
- Surveyed 4 legacy repos (product-service, order-service, auth-service,
  3D_Frontend). Verdict: transplant code, kill repo structures. Full salvage
  map in ARCHITECTURE-SUMMARY.md.
- Security debt found: real Gmail app password committed in auth-service
  (rotation = Lidor); PayPal sandbox creds hardcoded in order-service;
  order-service Docker "slicing" was secretly a Python approximation
  (smart-slicer.py symlinked as prusa-slicer).

## 2026-08-14 — Phase 0: monorepo scaffold

- Created repo, pushed to github.com/3D-FLY/3dfly (private).
- `backend/`: Gradle multi-module skeleton — `app` (api/worker modes via
  Spring profile) + modules `common, catalog, integrations, orders, partners,
  pricing, users, notifications`, each with package-info stating the isolation
  rule. Foojay resolver added (machine had only JDK 20; Gradle auto-downloads
  21). Single Dockerfile, mode via SPRING_PROFILES_ACTIVE.
- `frontend/`: imported from 3D_Frontend via `git subtree` — full history
  preserved. (Its untracked local CLAUDE.md was NOT imported.)
- CI: path-filtered workflows `backend-ci.yml` (gradle build) and
  `frontend-ci.yml` (npm ci + build).
- Gotcha fixed: `*.jar` gitignore rule ate gradle-wrapper.jar; negation must be
  `!**/gradle/wrapper/gradle-wrapper.jar`.

## 2026-08-14 — Phase 1: pricing module transplant

- Moved order-service quotation pipeline → `modules/pricing`
  (com.threedfly.pricing): PrintCalculationService + controller, slicer
  strategy layer (Prusa/Bambu + factory), 3MF/manual parameter extractors,
  DynamicIniGenerator, IniConfigurationMapper, ModelOrientationService,
  MaterialCombinationValidator, GlobalExceptionHandler, DTOs/enums/exceptions.
- Resources: 7 tuned INI profiles → `modules/pricing/slicer-configs/`;
  auto_orient_model.py → `modules/pricing/scripts/`; 13 real test models;
  mock-slicer. smart-slicer.py → `backend/tools/heuristic_estimator.py`
  (symlink hack killed; heuristic-vs-slicing now an explicit open decision).
- Tests: **110 passing, 8 auto-skip** (real-slicer suites gated on
  PrusaSlicer presence via @EnabledIf).
- Inherited bugs fixed in transit:
  - Two test classes hardcoded the original author's machine paths
    (/Users/sefica/...) — 32 mock-slicer tests + 15 real-model tests had never
    run anywhere else. Now repo-relative; real-model tests slicer-gated.
  - Dead @Transactional removed (module is DB-free).
  - junit-platform-launcher added (Boot 3.5 + Gradle test discovery fix).
- App-level contextLoads test boots all modules together; printing.* config
  lives in app application.yml with env-var overrides (PRUSA_SLICER_PATH,
  SLICER_CONFIG_DIR, PRINTING_TEMP_DIR, ORIENT_SCRIPT_PATH).

## 2026-08-14 — Tooling

- Installed jdtls (brew) + jdtls-lsp plugin (user scope) for Java LSP support
  in Claude Code. Needs session reload to activate.

## 2026-08-14 — Phase 2a: integrations module (Shopify OAuth + webhooks) + DB foundation

- **DB foundation:** one datasource in `app` (H2 file-backed dev default,
  Postgres via SPRING_DATASOURCE_* envs), Liquibase master changelog in app
  including per-module changelogs shipped in module jars. ddl-auto=validate
  everywhere — every Spring test doubles as schema/entity alignment check.
- **common module:** AES-GCM token encryption (AesEncryptionUtil +
  StringEncryptionConverter + EncryptionConfig, from product-service, 24 tests
  ported), HttpClientConfig (OkHttp), StoreUtils. Deliberately depends only on
  jakarta.persistence-api, NOT starter-data-jpa — keeps JPA autoconfig off the
  classpath of DB-free modules (pricing broke until this was fixed).
- **integrations module (com.threedfly.integrations):**
  - Ported: ShopifyConfig, ShopifyAuthService, ShopifyGraphQLService,
    HmacVerifier, IntegrationAccount (+repository), ShopType.
  - Reworked OAuthController — legacy had HMAC verification DISABLED, an
    in-memory state map, client-secret prefix logged, and a Shop-entity dep.
    Now: HMAC enforced on install + callback, single-use DB state row with
    10-min TTL (oauth_state table), slf4j with no secrets, accounts keyed by
    (provider, external_shop_id) — shop_id nullable until catalog (2b).
  - New ShopifyTokenClient (extracted token exchange; token-url-override for
    tests via MockWebServer).
  - **NEW order-ingestion webhooks** (the missing MVP half):
    ShopifyWebhookController POST /webhooks/shopify — HMAC on raw body
    (constant-time compare fix), durable inbox `webhook_event` with dedup on
    (provider, webhook_id), ack-fast contract; processing async later (worker).
  - Schema: integration_account, oauth_state, webhook_event (001 changelog).
- **Tests: 170 total** (pricing 120/8-skip, integrations 25, common 24, app 1).
  New coverage: HMAC unit (webhook+query, tamper/timing), webhook integration
  (valid→persisted, invalid→401, duplicate→idempotent, missing header),
  full OAuth flow vs MockWebServer (state TTL, replay rejected, expired
  rejected, forged-HMAC rejected, token ENCRYPTED AT REST verified via raw
  JDBC read).
- Runtime smoke: bootRun → health UP, Liquibase migrated, bad-HMAC webhook
  401, /oauth/accounts 200.
- Gotchas fixed: JPA repo/entity scanning needs explicit basePackages
  ("com.threedfly") in app; Spring 6.1 needs -parameters javac flag for
  @RequestParam (added in root build.gradle for all modules).
- Left for 2b: ShopifyProvider product publish + catalog module (Product/Shop/
  ProductSync), webhook→order.received processing in worker, reconciliation
  polling, fulfillment push-back.

## 2026-08-14 — Phase 2b: catalog module + Shopify product publishing

- **Migration tool decision:** stayed with Liquibase (challenged by Lidor;
  kept for H2-test/Postgres-prod dialect abstraction — revisit if we adopt
  Testcontainers). Immediately vindicated: H2's PostgreSQL mode has no BLOB
  type — Product blobs became plain byte[] (VARBINARY/bytea, no @Lob).
- **catalog module (com.threedfly.catalog):** Product, Shop entities; Product/
  Shop repositories (incl. 5 JPQL search queries); ProductService (CRUD only),
  ShopService; ProductMapper/ShopMapper + ModelMapper config; DTOs;
  ProductController (CRUD + image/STL file endpoints), ShopController.
  Changelog catalog/001 (shop, products). Fixes: JPA auditing actually enabled
  (@EntityListeners + @EnableJpaAuditing — legacy @CreatedDate never fired);
  ngrok URL hack → app.public-base-url property (PUBLIC_BASE_URL env).
- **Publishing (integrations):** StoreProvider interface moved from legacy
  common (it imports domain entities) and RETYPED — legacy returned
  ResponseEntity<?>, which is why ProductSync records were NEVER written
  (publish→delete was broken end-to-end). Now PublishResult record →
  PublishService upserts ProductSync (CREATED/UPDATED/FAILED + lastError).
  ShopifyProvider ported + hardened (userErrors checked after productCreate,
  slf4j, config-based media URL). PublishController: POST/DELETE
  /publish/products/{id}. ProductSync entity+repo in integrations.
  Deliberately not @Transactional across remote calls (FAILED record must
  survive the exception; no tx held over slow HTTP).
- **Left behind (dead code):** ImageUploader + ImageController (unused legacy
  filesystem/ngrok path), setup-shopify dev endpoint (raw token, hardcoded
  shop 1 — real OAuth replaces it), unused Shopify DTOs (Variant/Inventory/
  Metafield/Seo/Collections — never imported).
- **Tests: 206 total, 0 failures** (pricing 120/8-skip, integrations 30,
  catalog 31 = 23 ported ShopServiceTest + 8 new ProductServiceTest,
  common 24, app 1). New PublishServiceIntegrationTest drives the full
  GraphQL sequence against MockWebServer: happy path, re-publish→UPDATED,
  userErrors→FAILED+lastError, delete flow, unknown-account fail-fast.
- Runtime smoke: boot → health UP, /products + /shops serving, 3 changesets ran.
- Gotcha: test bootstrap apps also need explicit @EntityScan/
  @EnableJpaRepositories("com.threedfly") once they touch other modules' repos.

## 2026-08-15 — Phase 3: orders module (state machine + ledger) + webhook processing

- **orders module (com.threedfly.orders)** — pure domain, depends only on
  common. Order entity (marketplace as plain string to stay decoupled;
  optimistic @Version; unique (marketplace, external_order_id)), OrderItem
  (external ids + nullable catalogProductId for later matching),
  OrderLedgerEntry (append-only audit: from/to, actor SYSTEM/SELLER/PARTNER/
  ADMIN, override flag, reason).
- **State machine:** RECEIVED→PRICED→MATCHED→ACCEPTED→IN_PRODUCTION→SHIPPED→
  DELIVERED, + REJECTED→MATCHED reassignment loop, CANCELLED branches,
  terminal states frozen. transition() validates against the map;
  adminOverride() bypasses it but REQUIRES a reason and flags the ledger row
  (MVP "manual admin intervention allowed" made concrete + auditable).
- **OrderService.ingest():** idempotent on (marketplace, externalOrderId);
  every path writes the ledger in the same transaction.
- **OrderController:** GET /orders[?status], /orders/{id} (+items),
  /orders/{id}/ledger, POST /orders/{id}/transition, /orders/{id}/override.
  DTO views (open-in-view=false, lazy items fetched via join in service).
- **Webhook processing (integrations):** ShopifyOrderParser (orders/create
  payload → IngestOrderCommand), WebhookProcessingService (drains RECEIVED
  webhook_event rows; per-event error isolation — poison payload marks FAILED
  and never blocks the queue; unknown topics marked processed; unknown shop →
  order ingested without account link), WebhookInboxPoller (@Profile worker,
  @Scheduled 5s default). app: WorkerConfig enables scheduling ONLY in worker
  mode. Dependency direction: integrations → orders (orders stays pure).
- Changelog orders/001 (orders, order_item FK, order_ledger + indexes) added
  to app master + integrations test master.
- **Tests: 236 total, 0 failures** (orders 9 lifecycle tests, integrations 36
  incl. 6 webhook-processing E2E tests, rest unchanged).
- **Full-loop runtime smoke (worker profile):** POST signed webhook →200 →
  poller drained inbox → GET /orders shows normalized #2001 RECEIVED with
  ledger entry "Order ingested from SHOPIFY". First time the core MVP loop
  ran end-to-end on real HTTP.

## 2026-08-15 — Phase 4: partners module (routing + Partner Portal API)

- **partners module (com.threedfly.partners):** Partner entity (renamed from
  legacy Supplier — matches business language), FilamentStock/FilamentType
  (12 materials w/ temp specs), PartnerRepository incl. the ported stock-aware
  closest-partner native query (Haversine in SQL + stock JOIN — parked for the
  quotation flow), DistanceCalculator + 11 ported tests, GeocodingService
  (rewritten OkHttp + configurable base-url; was WebFlux), PartnerService
  (lean records, geocode-at-write-time enrichment; no ModelMapper ceremony —
  MVP scope says basic routing is enough).
- **Alpha matcher (OrderMatchingService):** RECEIVED→PRICED explicit
  pass-through (ledger says "quotation engine not yet wired") → MATCHED to
  nearest routable partner (active+verified+coords). Buyer coords from
  Shopify's embedded shipping lat/lon, else Nominatim geocoding. REJECTED
  orders re-matched excluding the rejector; unplaceable orders wait for admin.
  OrderMatchingPoller @Profile(worker), 7s.
- **Partner Portal API** (/partner-portal/{partnerId}): jobs list (scoped),
  accept, reject(reason), start, ship(tracking). Server-side guard: partner
  can only act on orders assigned to them (403 otherwise) — via new
  OrderService.partnerTransition/markShipped/matchToPartner.
- **orders additions:** tracking_number/carrier columns (changelog orders/002),
  findByPartnerIdAndStatusIn, NotAssignedPartnerException.
- Admin CRUD: /partners endpoints + verify/activate/deactivate lifecycle.
- **Tests: 253 total, 0 failures, 8 slicer-skips** (partners 32: matcher 6,
  portal flow E2E 5, geocoding 4 vs MockWebServer, partner service 6,
  distance 11 ported).
- **FULL LOOP SMOKE (live HTTP, worker profile):** create+verify partner →
  signed webhook #3001 → inbox drain → matcher (5.4 km) → portal accept →
  start → ship w/ tracking → SHIPPED. Ledger shows all 6 steps with actors.
  Bonus: yesterday's #2001 survived restart (file H2) and matched via REAL
  Nominatim geocoding (its address had no embedded coords).
- Note: jdtls LSP shows Lombok false-positives (no lombok agent configured);
  Gradle build is the source of truth.

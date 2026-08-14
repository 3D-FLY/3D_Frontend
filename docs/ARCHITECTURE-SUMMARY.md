# 3DFly — Architecture Summary

> Living document — updated as decisions are made.
> Last updated: 2026-08-14 (incorporated "MVP Scope Summary for Raz v0.1")

## The product

**3DFly** — a 3D-print fulfillment routing platform. Sellers on Shopify sell
worldwide; instead of printing locally and shipping internationally, orders are
routed to a vetted partner studio (local FDM fulfillment node) near the buyer,
which prints and ships domestically.

Core MVP loop:
**Shopify Store → Seller Portal → 3DFly Backend → Partner Portal → End Customer**

- **Our clients:** the sellers. Seller owns the brand; commerce stays on Shopify;
  seller remains Merchant of Record.
- **Our partners:** vetted local FDM print studios.
- **We own:** fulfillment logic — order ingestion, pricing, routing, status
  tracking, order ledger / audit trail. Not the seller brand, not checkout.

## MVP boundary (from 2026-06-22 workshop, Rotem + Raz)

**Shopify only · FDM only · vetted partners · basic routing · manual admin
intervention allowed**

Explicitly out of scope: Etsy/WooCommerce/Wix/Amazon integrations, 3D-model
marketplace, subscriptions, print-preparation service, analytics, chatbot,
advanced supplier ranking, advanced automation, full carrier API integration
(table-based shipping only), non-FDM production, unvetted partner network,
manual quote brokering, selling prints between store owners.

## Decisions so far

| Decision | Choice | Rationale |
|---|---|---|
| Backend language | **Java 21 + Spring Boot 3.5** (Gradle multi-module) | ~12k LOC of real, tested domain logic already exists in Java (slicing pipeline, Shopify integration); rewriting it would burn the best asset |
| Codebase strategy | **New monorepo; transplant code from legacy repos module-by-module** | Legacy repos are the microservice structure we decided against (2 DB engines, loose cross-service IDs), but their code maps 1:1 onto our modules |
| First integration | **Shopify only** | Locked in MVP scope doc; also the best marketplace API |
| Production tech | **FDM only**, vetted partners | MVP scope doc |
| Architecture style | Modular monolith + worker (NOT microservices) | Small team, boundaries still unproven; avoids distributed-systems tax at MVP |
| Compute | AWS ECS Fargate (NOT EKS) | Familiar industry-standard AWS, no k8s control-plane cost/ops burden; AWS Activate credits |
| Deployables | Two ECS services from **one Docker image**: `web` + `worker` | Fault isolation where it matters; slicing/pricing jobs are CPU-heavy and must never block webhook ingestion |
| Database | One Postgres (RDS) | Single transaction boundary; SQL joins for dashboard queries; order ledger lives here |
| Queue | Postgres-backed job queue for MVP (or SQS) | Transactional "save order + enqueue event" in one commit |
| Assets | S3 (presigned URLs) for 3D model files (STL/3MF) | Model files are large; keep them out of the DB |
| Auth | Managed provider (Clerk / Auth0 / Supabase Auth) | Building auth is a week we don't have |
| Payments | **Out of MVP** — pricing decides cost; payments is a separate project | Seller is Merchant of Record; marketplace payments need split payments, KYC, chargebacks, compliance |

## UI surfaces (three portals)

| Portal | Role | MVP features |
|---|---|---|
| **Seller Portal** | Connect, configure, monitor | Shopify connection, product + file management, pricing/availability controls, order status dashboard |
| **Partner Portal** | Accept, produce, update | Incoming jobs, job details, accept/reject, production + shipping updates. **Requires a notification system (Raz)** |
| **Admin Portal** | Control, override, resolve | Manage users + partners, monitor orders, routing override, exceptions + disputes |

## Domain modules (future microservice seams)

Each module owns its own tables and exposes an internal interface — no reaching
into another module's data. All live in one codebase for now.

1. **Integrations (Ingestion)** — Shopify connector: OAuth, webhook receivers,
   reconciliation polling. Output: normalized internal `Order` events. Pushes
   tracking/fulfillment status back to Shopify.
2. **Orders (core)** — The order lifecycle state machine; single source of truth
   for status. `received → priced → matched_to_partner → accepted →
   in_production → shipped → delivered` (+ reject/reassign/admin-override
   paths). Owns the **order ledger / audit trail** — every transition and
   override (with reason) recorded.
3. **Pricing** — The commercial brain and calibration target.
   `Seller Fulfillment Price = Production Estimate + Shipping Estimate + 3DFly Fee`.
   - *Production Cost Engine:* file-based estimation — material weight, print
     time, bounding box, support flag, setup/handling, minimum price.
     Recommended: slicing-based / hybrid slicing + machine occupancy. Print
     params (layer height, walls, infill) come from the seller; standard
     defaults if unset (Raz).
   - *Shipping Engine:* table-based — service region, bounding-box class,
     weight class, logistics profile. No live carrier rates in Alpha.
   - *3DFly Fee:* configurable markup, manual override with reason.
   - *Order Pricing Record:* per order — all components, final merchant charge,
     confidence level, override reason. Required for learning/audit/calibration.
4. **Partners (Studios)** — Partner profiles, FDM capabilities, capacity,
   geography. Basic routing + fallback + admin override (no advanced ranking in
   MVP). Serves the Partner Portal API.
5. **Users (Sellers + Admin)** — Accounts, seller dashboard API, connected-shop
   management, admin user/partner management. Auth delegated to managed provider.
6. **Notifications** — **MVP-required** (partner portal depends on it): new-job
   alerts to partners, status updates to sellers, fulfillment/tracking pushed
   back to Shopify.

**Deferred (not MVP):** payments/payouts, analytics, subscriptions, dedicated
asset service, carrier APIs, advanced routing.

## Communication rules

- **Request/response** (dashboard reads, portal reads): in-process function calls.
- **Order lifecycle + pricing jobs**: async via job queue, always. Webhook
  arrives → ack immediately → enqueue → worker processes. Slicing-based
  estimation is CPU-heavy and belongs exclusively in the worker.
- Every lifecycle transition is a named event (`order.received`, `order.priced`,
  `order.matched`, `partner.accepted`, `order.shipped`). Keeping this discipline
  makes later extraction a matter of swapping the in-process bus for SQS/SNS.

## AWS footprint (MVP)

```
ALB ──▶ ECS Fargate `web` (×2 tasks)     RDS Postgres (incl. order ledger)
        ECS Fargate `worker` (×1 task,   SQS (or pg queue)
          sized for slicing jobs)        S3 (STL/3MF model files)
        ECR (one repo)                   Deploy: GitHub Actions
```

Worker image bundles a slicer CLI (e.g. PrusaSlicer/CuraEngine) if we go
slicing-based estimation. Estimated ~$100–150/month; AWS Activate credits
likely cover year one.

## Order flow

```
Shopify ──webhook──▶ Integrations ──order.received──▶ Orders (state machine + ledger)
                                                        │ order.priced (Pricing engine)
                                                        │ order.matched
                                                        ▼
Seller Portal ◀── Users/API      Partners (routing + Partner Portal)
Admin Portal  ◀── (override/exceptions)    │ accepted / in_production / shipped
                                                        ▼
                     Notifications ──▶ partner alerts / seller updates
                           └──▶ fulfillment + tracking pushed back to Shopify
```

## When to split a module out

Not on a schedule — when a seam *hurts*: deploy contention, one module eating
all the CPU, a genuinely independent scaling need. Likely first candidates:
**Pricing** (CPU-heavy slicing) or **Integrations** (Shopify rate limits).

## Existing codebase assessment (2026-08-14)

Four legacy repos surveyed. Verdict: **kill the repo structures, transplant the
code.** The backend holds real differentiated IP; the frontend is polished
pixels with 0% integration (no API client, mock data everywhere, fake auth).

| Legacy repo | State | Salvage into |
|---|---|---|
| `order-service` (Java 21, SB 3.5) | **Crown jewels:** working STL/3MF quotation pipeline — param extraction, 7 tuned slicer INI profiles, real PrusaSlicer CLI invocation, G-code parsing → weight/time/price; auto-orientation (trimesh); PayPal marketplace-split payments w/ audit trail | Pricing (pipeline), Orders (entities as a start), Payments (parked, post-MVP) |
| `product-service` (Java 21, SB 3.5) | Working Shopify OAuth + Admin GraphQL product publish + HMAC verify; closest-supplier routing (Haversine + Nominatim geocoding); filament inventory. Webhooks half-built; STL/image blobs in DB (move to S3); no migrations | Integrations (Shopify), Partners (routing/inventory) |
| `auth-service` (Java 17, SB 3.2) | Well-built (JWT+refresh cookies, Google login, email verification, device fingerprinting; heavily tested) but duplicates managed auth; in-memory blacklist, bare-VM deploy | **Retire.** Keep only ADMIN/SELLER/SUPPLIER role taxonomy |
| `3D_Frontend` (React 18, Vite 7, Tailwind 4) | Production-ready marketing site + seller/admin dashboard shells + map infra + design system. **No API client, no env config, all mock data, unguarded routes, no tests** | Keep nearly all UI; add API client, real auth, replace mocks. Partner Portal doesn't exist yet — must be built |

### Transplant map (code-level)

Seven Gradle modules (catalog promoted to its own module — real code exists).
Two ECS services from one image: **`3dfly-api`** (HTTP: portals, webhooks) and
**`3dfly-worker`** (queue: slicing, routing, notifications) — split by workload
type, not domain.

| New module | From | Transplant | New work |
|---|---|---|---|
| `pricing` (~80% ported) | order-service | Quotation pipeline, slicer strategy classes, 3MF/manual extractors, DynamicIniGenerator, 7 INI profiles, auto-orient, `smart-slicer.py` → explicit `HeuristicEstimator` (kill symlink hack) | Shipping table engine, 3DFly fee layer, OrderPricingRecord |
| `integrations` (~60%) | product-service | shopify-integration module (OAuth, GraphQL publish, HmacVerifier, StoreProvider), IntegrationAccount | **Order webhooks** (missing half!), reconciliation polling, fulfillment push-back; OAuth state → DB |
| `partners` (~70%) | product-service | Supplier, FilamentStock/Type, GeocodingService, DistanceCalculator, closest-supplier routing (moves here from its OrderService) | Partner Portal API: job queue, accept/reject, tracking upload |
| `orders` (~25%) | order-service | Order entity/repo skeleton; audit pattern borrowed from PaymentAudit | Full state machine + admin overrides, order ledger |
| `catalog` (~70%) | product-service | Product, Shop, ShopType, ProductSync, ImageUploader, print params | Blobs → S3 presigned URLs |
| `users` (~20%) | auth-service | ADMIN/SELLER/SUPPLIER taxonomy, Seller entity (order-service) | Thin JWT-validation filter for managed provider; auth machinery retired |
| `notifications` (~20%) | auth-service | EmailService/MockEmailService conditional pattern | Job-alert + status templates on lifecycle events |
| `common` / `app` | both | AES token encryption + converter, exception handler, NgrokAutoStartService (dev profile) | Event/job-queue plumbing (100% new), api/worker entrypoint, Liquibase |

Left behind (archived repos, post-MVP): PayPal split payments + lock/audit
services, Stripe stub, push scripts, nginx/VM deploy.

Cross-cutting reworks: MySQL → Postgres (check every JPQL/native query; write
Liquibase baseline fresh — product-service has no migrations), re-namespace
flat packages (`package entity;` → `com.threedfly.<module>.*`).

**Security debt found (fix regardless of direction):**
1. Real Gmail app password committed in `auth-service` `application.properties` — rotate immediately (in git history forever).
2. PayPal sandbox credentials hardcoded in `order-service` `application.properties`.
3. `order-service` Dockerfile symlinks `smart-slicer.py` (crude Python
   estimator) as `prusa-slicer` — deployed "slicing" silently isn't slicing.
   Dev/prod fidelity gap; must become an explicit hybrid decision, not an
   accident.

## Open questions

1. ~~UI stack / backend language~~ — **Resolved: Java 21 + Spring Boot modular
   monolith; frontend stays Vite + React.**
2. **Shipping pricing mechanism (Raz):** fixed price per region vs. real-time
   lookup by end-customer location. MVP doc leans table-based per region.
3. **Production estimation depth:** true slicing (accurate, heavy, slicer binary
   in worker image) vs. heuristic mesh estimate (`smart-slicer.py`, fast/rough)
   vs. hybrid. Scope doc recommends slicing/hybrid; legacy code has both halves.
4. **How do partners receive model files?** Presigned S3 downloads from the
   Partner Portal is the working assumption.

## Next steps

- Rotate the committed Gmail app password; externalize PayPal creds.
- ~~Scaffold the new monorepo~~ **Done** — repo live at 3D-FLY/3dfly, backend
  skeleton + frontend (with history) + path-filtered CI.
- ~~Transplant Pricing~~ **Done 2026-08-14** — quotation pipeline, slicer
  strategies, extractors, INI generator + 7 material profiles, auto-orient
  script, exception handler; 110 tests green, 8 slicer-gated tests auto-skip
  without PrusaSlicer. Fixed inherited bugs: hardcoded author-machine paths in
  two test classes (mock-slicer + real-model tests never ran anywhere else);
  `smart-slicer.py` now lives honestly at `backend/tools/heuristic_estimator.py`
  (no prusa-slicer symlink). Next in Pricing: shipping table engine, fee layer,
  OrderPricingRecord.
- Next transplant: **Integrations** (Shopify OAuth + GraphQL publish) + build
  the missing order webhooks.
- Draft DB schema (incl. Order Pricing Record + ledger) and the order state
  machine with admin-override paths — one Postgres + Liquibase.
- Wire the frontend to the new backend (API client, managed auth, kill mocks);
  build the missing Partner Portal.

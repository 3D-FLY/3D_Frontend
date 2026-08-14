# 3DFly

3D-print fulfillment routing platform. Sellers on Shopify sell worldwide;
orders are routed to a vetted partner print studio (local FDM node) near the
buyer, which prints and ships domestically.

Core loop: **Shopify Store → Seller Portal → 3DFly Backend → Partner Portal →
End Customer**

Full architecture and decision log: [docs/ARCHITECTURE-SUMMARY.md](docs/ARCHITECTURE-SUMMARY.md)

## Repository layout

```
backend/    Java 21 + Spring Boot 3.5, Gradle multi-module modular monolith
  app/          Boot entrypoint — one image, two run modes (profiles):
                  api    → HTTP: portal APIs, Shopify webhooks
                  worker → queue: slicing, routing, notifications
  modules/      Domain modules (each owns its tables; talk via services/events):
                  common, catalog, integrations, orders, partners,
                  pricing, users, notifications
frontend/   Vite + React + Tailwind SPA (marketing site + seller/admin portals)
infra/      Terraform — ECS Fargate, RDS Postgres, S3, SQS, ECR (coming)
docs/       Architecture summary and decision log
```

## Development

Backend (requires JDK 21):

```sh
cd backend
./gradlew build                                # compile + test everything
./gradlew :app:bootRun                         # api mode (default profile)
SPRING_PROFILES_ACTIVE=worker ./gradlew :app:bootRun   # worker mode
```

Frontend (requires Node 20+):

```sh
cd frontend
npm install
npm run dev
```

## Deployment model

Three independent artifacts, one repo. CI path filters rebuild only what
changed:

| Artifact | Source | Deploys to |
|---|---|---|
| `3dfly-api` + `3dfly-worker` | `backend/**` → one Docker image | ECR → ECS Fargate |
| Frontend | `frontend/**` → static bundle | Vercel |
| Infra | `infra/**` | AWS via Terraform |

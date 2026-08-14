# infra

Terraform for the AWS footprint (Phase 5):

- ECS Fargate cluster with two services from one ECR image:
  `3dfly-api` (behind ALB, ×2 tasks) and `3dfly-worker` (×1 task)
- RDS Postgres (single database; Liquibase owns the schema)
- S3 (model files, presigned URLs)
- SQS (job queue) — MVP may start with a Postgres-backed queue instead
- CloudWatch logs, ECR repo, GitHub Actions OIDC deploy role

Nothing here yet — added when we reach the deploy phase.

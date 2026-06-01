.PHONY: dev build lint test clean docker-up docker-down db-generate db-push db-migrate db-seed db-studio format help

help:
	@echo "DiasporaLink Development Commands"
	@echo "================================="
	@echo "make dev          - Start all services in dev mode (turbo)"
	@echo "make build        - Build all packages"
	@echo "make lint         - Run TypeScript checks"
	@echo "make format       - Format code with Prettier"
	@echo "make clean        - Remove node_modules and build output"
	@echo "make docker-up    - Start PostgreSQL, MinIO, Mailpit"
	@echo "make docker-down  - Stop Docker services"
	@echo "make db-generate  - Generate Prisma client"
	@echo "make db-push      - Push schema to database"
	@echo "make db-migrate   - Run Prisma migrations"
	@echo "make db-seed      - Seed database with demo data"
	@echo "make db-studio    - Open Prisma Studio"
	@echo "make api-dev      - Start API server only"
	@echo "make web-dev      - Start web app only"
	@echo "make test         - Run all tests"
	@echo "make test-e2e     - Run Playwright E2E tests"
	@echo "make test-api     - Run API tests"

dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

format:
	pnpm format

clean:
	pnpm clean

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

db-generate:
	pnpm db:generate

db-push:
	pnpm db:push

db-migrate:
	pnpm db:migrate

db-seed:
	pnpm db:seed

db-studio:
	pnpm db:studio

api-dev:
	pnpm --filter @diaspora/api dev

web-dev:
	pnpm --filter @diaspora/web dev

test:
	pnpm --filter @diaspora/web test && pnpm --filter @diaspora/api test

test-e2e:
	pnpm --filter @diaspora/web test:e2e

test-api:
	pnpm --filter @diaspora/api test

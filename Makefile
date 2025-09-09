.PHONY: init run stop migrate-up migrate-down migrate-create

MIGRATION_PATH=migrations

init:
	@echo "Starting all containers except api-dev in background..."
	docker compose up -d --scale api-dev=0
	@echo "Running migrations..."
	docker compose run --rm --no-deps api-dev npm run migration:up
	@echo "Starting api-dev in foreground..."
	docker compose up api-dev

clean:
	@echo "Stopping and removing all containers..."
	docker compose down --rmi all

migrate-up:
	docker compose run --rm --no-deps api-dev npm run migration:up

migrate-down:
	docker compose run --rm --no-deps api-dev npm run migration:down

migrate-create:
	@if [ -z "$(name)" ]; then \
		echo "You must provide a migration name: make migrate-create name=MinhaMigration"; \
		exit 1; \
	fi
	docker compose run --rm --no-deps api-dev npm run migration:create -- $(MIGRATION_PATH)/$(name)
	@echo "Migration created: $(MIGRATION_PATH)/$(name)"
	@echo "Run 'make migrate-up' to apply the migration."
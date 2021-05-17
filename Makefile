init-dev: down-dev build-dev up-dev
init-prod: down-prod build-prod up-prod

up-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d no=deps

build-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

build-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

down-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

down-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

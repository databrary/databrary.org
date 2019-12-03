include .env

# MAKEFLAGS += --silent

# Only dev is available for now
# TODO(REDA): add docker-compose.prod.yml files for production servers

.PHONY: server client compose cleardb migrate install setup_minio

DEV ?= 1

is_hasura_running:
	docker-compose ps | grep -q "graphql-engine"

is_mino_running:
	docker-compose ps | grep -q "minio"

compose:
ifeq ($(DEV), 1)
	@echo 'Starting Databrary in development mode'
	docker-compose -f docker-compose.dev.yml up
else 
	@echo 'Starting Databrary in production mode'
	docker-compose -f docker-compose.prod.yml up
endif

server:
# We run then server sepratly from other docker services, only with docker-compose.dev.yml
ifeq ($(DEV), 1)
	@echo 'Starting Development Server'
	docker-compose -f docker-compose.dev.yml up server
else 
	@echo 'Cannot start the server in production, try: make dev server'
endif 

client:
# We run then client sepratly from other docker services, only with docker-compose.dev.yml
ifeq ($(DEV), 1)
	@echo 'Starting Development Client'
	docker-compose -f docker-compose.dev.yml up client
else
	@echo 'Cannot start the client in production,  try: make dev client'
endif 

cleardb:
	docker-compose down -v

is_db_outdated: is_hasura_running
	cd hasura && hasura migrate status | grep -q "Not Present" && cd ..;

migrate: is_db_outdated
	cd hasura && hasura migrate apply --endpoint ${HASURA_ENDPOINT} --admin-secret ${HASURA_SECRET} && cd ..

install_docker_compose:
	sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose &&
	sudo chmod +x /usr/local/bin/docker-compos;

install_hasura_cli:
	curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash

install_minio_cli:
	sudo curl -L https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/ &&
	sudo chmod +x /usr/local/bin/mc;

install: install_docker_compose install_hasura_cli install_minio_cli

setup_minio: is_mino_running
	cd minio;
	mc config host add minio ${MINIO_URL} ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY};
	mc admin config set minio < minioconfig;
	mc admin service restart minio;
	mc mb minio/uploads;
	mc mb minio/cas;
	mc event add minio/uploads arn:minio:sqs::1:webhook --event put;
	cd ..;
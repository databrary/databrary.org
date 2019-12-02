include .env

SERVER_DIR = $(PWD)/server
CLIENT_DIR = $(PWD)/client

.PHONY: server client cleardb migrate install_app setup_minio

is_hasura_running:
	docker-compose ps | grep -q "graphql-engine"

is_mino_running:
	docker-compose ps | grep -q "minio"

databrary:
	docker-compose up

server:
	docker-compose up server

client:
	docker-compose up client

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

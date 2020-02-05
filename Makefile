include .env

UNAME := $(shell uname -s)
# Need to find platform and export docker host ip
# https://nickjanetakis.com/blog/docker-tip-65-get-your-docker-hosts-ip-address-from-in-a-container
# if Mac/Win use host.docker.internal
# if linux find the ip of docker0 when running ip a

.PHONY: server client cleardb migrate install setup_minio setup_migrations

is_hasura_running:
	docker-compose ps | grep -q "graphql-engine"
is_minio_running:
	docker-compose ps | grep -q "minio"

start_docker:
ifeq ($(UNAME),Linux)
	docker-compose -f docker-compose.gnu.yml up -d
else
	docker-compose up -d
endif
stop_docker:
ifeq ($(UNAME),Linux)
	docker-compose -f docker-compose.gnu.yml down
else
	docker-compose down
endif
cleardb:
ifeq ($(UNAME),Linux)
	docker-compose -f docker-compose.gnu.yml down -v
else
	docker-compose down -v
endif
docker:
ifeq ($(UNAME),Linux)
	docker-compose -f docker-compose.gnu.yml up
else
	docker-compose up
endif
server:
ifdef DEV
	@echo "Running development server"
	cd server && npm run dev -- --env=dev && cd ..
else
	@echo "Running production server"
	cd server && npm run dev && cd ..
endif
client:
	cd client && npm run dev && cd ..
migrate:
	cd hasura && hasura migrate apply && hasura console && cd ..
queue:
	cd server && npm run queue && cd ..

install_docker_compose:
	sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose &&
	sudo chmod +x /usr/local/bin/docker-compos;
install_hasura_cli:
	curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
install_minio_cli:
	sudo curl -L https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/ &&
	sudo chmod +x /usr/local/bin/mc;
install: install_docker_compose install_hasura_cli install_minio_cli
	npm install -g yarn;
	npm install -g typescript;
	npm install -g ts-node-dev;
	npm install -g @quasar/cli;
	cd server && yarn && cd ..;
	cd client && yarn && cd ..;

setup_migrations:
	cd hasura && hasura migrate apply && cd ..

setup_minio:
	mc config host add minio ${MINIO_URL} ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY};
	mc admin config set minio < minio/minioconfig;
	mc admin service restart minio;
	mc mb minio/uploads;
	mc mb minio/cas;
	mc event add minio/uploads arn:minio:sqs::1:webhook --event put;

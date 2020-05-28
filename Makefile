include .env

##############################################################################
# This will detect the correct system, except if you're using WSL.
# For WSL, make sure to set WSL=1 in your .env file or environment.

UNAME := $(shell uname -s)
DOCKER_HOST_IP = host.docker.internal

ifeq ($(UNAME),Linux)
	ifeq ($(WSL),0)
		DOCKER_HOST_IP = $(shell ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')
	endif
endif

info:
	@echo UNAME: $(UNAME)
	@echo WSL: $(WSL)
	@echo DOCKER_HOST_IP: $(DOCKER_HOST_IP)

##############################################################################

.PHONY: server client cleardb migrate install setup_minio setup_migrations

is_hasura_running:
	docker-compose ps | grep -q "graphql-engine"
is_minio_running:
	docker-compose ps | grep -q "minio"

start_docker:
	docker-compose up -d
stop_docker:
	docker-compose down
cleardb:
	docker-compose down -v
docker:
	DOCKER_HOST_IP=$(DOCKER_HOST_IP) docker-compose up 
server:
ifdef DEV
	@echo "Running development server"
	cd server && npm run dev -- --env=dev && cd ..
else
	@echo "Running production server"
	cd server && npm run dev && cd ..
endif
server_nest:
	cd server-nest && npm run start:dev && cd ..
server_debug: 
	cd server-nest && npm run start:debug && cd ..
client:
	cd client && npm run dev && cd ..
migrate:
	cd hasura && hasura migrate apply && hasura console && cd ..
queue:
	cd server && npm run queue && cd ..

install_ubuntu_dependencies:
	apt-get install make
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
	nvm install node

install_docker_compose:
	sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose

install_hasura_cli:
	curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash

install_minio_cli:
ifeq ($(UNAME),Darwin)
	brew install minio/stable/mc
else
	sudo curl -L https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc &&	sudo chmod +x /usr/local/bin/mc
endif

install_js_clis:
	npm install -g yarn
	npm install -g @quasar/cli

install_js_packages:
	cd server && yarn && cd ..;
	cd client && yarn && cd ..;

# install: install_docker_compose install_hasura_cli install_minio_cli install_js_clis install_js_packages

setup_migrations:
	cd hasura && hasura migrate apply && cd ..

setup_minio:
	mc config host add minio ${MINIO_URL} ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY}
	mc admin config set minio/ notify_webhook:1 endpoint="http://${DOCKER_HOST_IP}:8000/minio/webhook" queue_dir="/events" queue_limit="10000"
	mc admin service restart minio;
	mc mb -p minio/uploads;
	mc mb -p minio/cas;
	mc mb -p minio/public;
	mc policy set public minio/public;
	mc event add minio/uploads arn:minio:sqs::1:webhook --event put
	mc event add minio/cas arn:minio:sqs::1:webhook --event put
	mc event add minio/public arn:minio:sqs::1:webhook --event put

fix_es_lint:
	npx eslint --ext .ts . --fix
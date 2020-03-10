include .env

# TODO differentiate WSL Linux and Linux see:
# https://stackoverflow.com/questions/38086185/how-to-check-if-a-program-is-run-in-bash-on-ubuntu-on-windows-and-not-just-plain
UNAME := $(shell uname -s)
SYSTEM = Linux

ifeq ($(UNAME),Linux)
ifdef $(WSL)
	SYSTEM = 'WSL'
endif
else
ifeq ($(UNAME),Darwin)
	SYSTEM = 'Mac'
else
	SYSTEM = 'Windows'
endif
endif

DOCKER_HOST_IP = host.docker.internal
ifeq ($(SYSTEM),Linux) 
	DOCKER_HOST_IP=$(shell ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')
endif

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
client:
	cd client && npm run dev && cd ..
migrate:
	cd hasura && hasura migrate apply && hasura console && cd ..
queue:
	cd server && npm run queue && cd ..

install_docker_compose:
	sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose;
install_hasura_cli:
	curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
install_minio_cli:
ifeq ($(UNAME),Darwin)
	brew install minio/stable/mc
else
	sudo curl -L https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc &&	sudo chmod +x /usr/local/bin/mc
endif
install_js_clis:
	npm install -g yarn;
	npm install -g typescript;
	npm install -g ts-node-dev;
	npm install -g @quasar/cli;
install_js_packages:
	cd server && yarn && cd ..;
	cd client && yarn && cd ..;
install: install_docker_compose install_hasura_cli install_minio_cli install_js_clis install_js_packages

setup_migrations:
	cd hasura && hasura migrate apply && cd ..

setup_minio:
	mc config host add minio ${MINIO_URL} ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY}
ifeq ($(SYSTEM),Linux)
	mc admin config set minio/ notify_webhook:1 endpoint="http://${DOCKER_HOST_IP}:8000/webhooks/minio" queue_dir="/events" queue_limit="10000"
else
	mc admin config set minio/ notify_webhook:1 endpoint="http://host.docker.internal:8000/webhooks/minio" queue_dir="/events" queue_limit="10000"
endif
	mc admin service restart minio;
	mc mb -p minio/uploads;
	mc mb -p minio/cas;
	mc mb -p minio/avatars;
	mc event add minio/uploads arn:minio:sqs::1:webhook --event put
	mc event add minio/avatars arn:minio:sqs::1:webhook --event put

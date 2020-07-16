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
# Check if binary exists
##############################################################################
EXISTS:
EXISTS-%:
	@which $* > /dev/null 

##############################################################################
# Check node version
##############################################################################
NODE_VERSION=14.0.0
check_node_version:
	@if [ $(shell node --version) != v$(NODE_VERSION) ]; then\
		echo "ERROR: Databrary recommends node v$(NODE_VERSION).";\
		echo "We also recommend nvm and running";\
		echo "    nvm install $(NODE_VERSION)";\
		echo "    nvm use $(NODE_VERSION)";\
	fi;

##############################################################################
# Install JS Packages: yarn install packages
##############################################################################
JS_DIRS=client server server-nest

define install_js_rule
$(1)/node_modules: $(1)/package.json $(1)/yarn.lock
	cd $(1) && yarn && cd ..
endef

# $(foreach dir,$(JS_DIRS),$(eval $(call install_js_rule, $(dir))))

JS_DEPS=\
	EXISTS-node\
	EXISTS-yarn\
	check_node_version
	# $(foreach dir,$(JS_DIRS),$(dir)/yarn.lock)

# install_js_packages: $(JS_DEPS)
##############################################################################

start_docker:
	docker-compose up -d
stop_docker:
	docker-compose down
cleardb:
	docker-compose down -v
docker:
	DOCKER_HOST_IP=$(DOCKER_HOST_IP) docker-compose up 
server: client/node_modules
ifdef DEV
	@echo "Running development server"
	cd server && npm run dev -- --env=dev && cd ..
else
	@echo "Running production server"
	cd server && npm run dev && cd ..
endif
server_nest:client/node_modules
	cd server-nest && npm run start:dev && cd ..
server_debug: client/node_modules
	cd server-nest && npm run start:debug && cd ..
client: client/node_modules
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

##############################################################################
.PHONY: node_version server client cleardb migrate install setup_minio setup_migrations
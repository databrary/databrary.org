include .env

##############################################################################
# This will detect the correct system, except if you're using WSL.
# For WSL, make sure to set WSL=1 in your .env file or environment.
##############################################################################
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
DOC_INSTALL_yarn="Please install yarn using npm -g install yarn"
exists:
exists-%:
	$(eval INSTRUCTIONS := $(if $(DOC_INSTALL_$*),$(DOC_INSTALL_$*),"Please install $*"))
	@command -v $* >/dev/null 2>&1 || echo $(INSTRUCTIONS)

##############################################################################
# Check node version
##############################################################################
NODE_VERSION=14.0.0
check-node-version:
	@if [ $(shell node --version) != v$(NODE_VERSION) ]; then\
		echo "ERROR: Databrary recommends node v$(NODE_VERSION).";\
		echo "We also recommend nvm and running";\
		echo "    nvm install $(NODE_VERSION)";\
		echo "    nvm use $(NODE_VERSION)";\
	fi;

##############################################################################
# Setup rules and targets for yarn installs
##############################################################################
JS_DIRS=client server server-nest

define install-js-rule
$(1)/node_modules: $(1)/package.json $(1)/yarn.lock
	cd $(1) && yarn && touch node_modules && cd ..
endef

$(foreach dir,$(JS_DIRS),$(eval $(call install-js-rule,$(dir))))

##############################################################################
# Maintenance Rules
##############################################################################
upgrade-quasar:
	cd client && npx quasar upgrade && npx quasar upgrade --install && cd ..
##############################################################################

start_docker:
	docker-compose up -d
stop_docker:
	docker-compose stop
cleardb:
	docker-compose down -v
docker:
	DOCKER_HOST_IP=$(DOCKER_HOST_IP) docker-compose up 
server: check-node-version exists-yarn server/node_modules
ifdef DEV
	@echo "Running development server"
	cd server && npm run dev -- --env=dev && cd ..
else
	@echo "Running production server"
	cd server && npm run dev && cd ..
endif
server_nest: check-node-version exists-yarn server-nest/node_modules
	cd server-nest && npm run start:dev && cd ..
server_debug: check-node-version exists-yarn server-nest/node_modules
	cd server-nest && npm run start:debug && cd ..

client: check-node-version exists-yarn client/node_modules
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

setup_migrations:
	cd hasura && hasura migrate apply && cd ..

setup_minio:
	docker build -t mc ./docker-assets/minio/ && docker run --env=DOCKER_HOST_IP=$(DOCKER_HOST_IP) --env-file=./.env --rm --network="host" -it mc

fix_es_lint:
	npx eslint --ext .ts . --fix

##############################################################################
.PHONY: node_version server client cleardb migrate install setup_minio setup_migrations
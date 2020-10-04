include .env

##############################################################################
# Docs
##############################################################################
help: FORCE # Source: https://stackoverflow.com/a/59087509
	@grep -B1 -E "^[a-zA-Z0-9_-]+\:([^\=]|$$)" Makefile \
     | grep -v -- -- \
     | sed 'N;s/\n/###/' \
     | sed -n 's/^#: \(.*\)###\(.*\):.*/\2###\1/p' \
     | column -t  -s '###'

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

#: Prints docker info
docker-info: FORCE
	@echo UNAME: $(UNAME)
	@echo WSL: $(WSL)
	@echo DOCKER_HOST_IP: $(DOCKER_HOST_IP)

##############################################################################
# Check if binary exists
##############################################################################
DOC_INSTALL_yarn="Please install yarn using npm -g install yarn"
DOC_INSTALL_docker-compose="Please install docker-compose using make install-docker-compose"
bin-exists: FORCE
bin-exists-%: FORCE
	$(eval INSTRUCTIONS := $(if $(DOC_INSTALL_$*),$(DOC_INSTALL_$*),"Please install $*"))
	@command -v $* >/dev/null 2>&1 || echo $(INSTRUCTIONS)

##############################################################################
# Check node version
##############################################################################
NODE_VERSION=14.0.0
check-node-version: FORCE
	@if [ $(shell node --version) != v$(NODE_VERSION) ]; then\
		echo "ERROR: Databrary recommends node v$(NODE_VERSION).";\
		echo "We also recommend nvm and running";\
		echo "    nvm install $(NODE_VERSION)";\
		echo "    nvm use $(NODE_VERSION)";\
	fi;

##############################################################################
# Setup rules and targets for yarn installs
##############################################################################
JS_DIRS=client server-nest

define install-js-rule
$(1)/node_modules: $(1)/package.json $(1)/yarn.lock
	@cd $(1) && yarn && touch node_modules && cd ..
endef

$(foreach dir,$(JS_DIRS),$(eval $(call install-js-rule,$(dir))))

##############################################################################
# Maintenance Rules
##############################################################################
upgrade-quasar: FORCE
	cd client && npx quasar upgrade && npx quasar upgrade --install && cd ..

upgrade-hasura-cli: FORCE
	cd hasura && hasura update-cli && hasura scripts update-project-v2 && cd ..

##############################################################################
# Hasura
##############################################################################
#: Start hasura console for live persistence of migrations
migrate: FORCE
	cd hasura && hasura console --skip-update-check --endpoint http://127.0.0.1:8000 && cd ..

metadata: FORCE
	cd hasura && hasura metadata export --skip-update-check --endpoint http://127.0.0.1:8000 && cd.. 

##############################################################################
# Minio
##############################################################################
MINIO_IMAGE=minio-cli
MINIO_DIR=./docker-assets/$(MINIO_IMAGE)

check-image-minio-cli: FORCE
	@if [ -z "$$(docker images -q $(MINIO_IMAGE):latest 2> /dev/null)" ]; then\
		touch $(MINIO_DIR)/Dockerfile;\
	fi

$(MINIO_DIR): $(MINIO_DIR)/Dockerfile $(MINIO_DIR)/bootstrap.sh
	@docker build -t $(MINIO_IMAGE) $(MINIO_DIR)/
	@touch $@

setup_minio: check-image-minio-cli $(MINIO_DIR)
	@docker run\
		--env=DOCKER_HOST_IP=$(DOCKER_HOST_IP)\
		--env-file=./.env\
		--network="host"\
		-it $(MINIO_IMAGE)

##############################################################################
# Some prerequesities until we get everything dockerfied
###############################################################################
install-nvm: FORCE
ifeq ($(wildcard $(NVM_DIR)),)
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
	nvm install node
endif

install-make: FORCE
ifeq ($(shell dpkg -l | cut -d " " -f 3 | grep "^make"),)
	sudo apt-get install makdde
endif

install-docker-compose: FORCE
ifeq ($(shell command -v docker-compose 2> /dev/null),)
	sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
endif

install-hasura-cli: FORCE
ifeq ($(shell command -v hasura 2> /dev/null),)
	curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
endif

#: Install dependencies, some of which require sudo, for an ~Ubuntu machine
install-ubuntu-dependencies: install-docker-compose install-nvm install-make install-hasura-cli

###############################################################################
# Primary commands for this app
###############################################################################
start_docker: bin-exists-docker-compose
	docker-compose up -d
stop_docker: bin-exists-docker-compose
	docker-compose stop

#: Destroy all docker images and thus databases
cleardb: bin-exists-docker-compose
	docker-compose down -v

#: Start docker in non-deamon mode
docker: bin-exists-docker-compose
	DOCKER_HOST_IP=$(DOCKER_HOST_IP) docker-compose up

#: Start the Nest.js server in non-daemon mode
server_nest: check-node-version bin-exists-yarn server-nest/node_modules
	cd server-nest && rm -rf dist && npm run start:dev && cd ..
server_test: FORCE
	cd server-nest && npm run test && cd ..
server_debug: check-node-version bin-exists-yarn server-nest/node_modules
	cd server-nest && npm run start:debug && cd ..

#: Start the front-end in non-daemon mode
client: check-node-version bin-exists-yarn client/node_modules
	cd client && npm run dev && cd ..

fix_es_lint: FORCE
	npx eslint --ext .ts . --fix

##############################################################################
all: ;
FORCE: ;
.PHONY: FORCE
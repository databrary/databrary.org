include .env

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

server:
	cd server && ts-node-dev src/index.ts && cd ..
client:
	cd client && yarn run dev && cd ..
migrate:
	cd hasura && hasura migrate apply && hasura console && cd ..
queue:
	cd server && ts-node-dev bin/worker.ts && cd ..
docker:
	docker-compose up

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

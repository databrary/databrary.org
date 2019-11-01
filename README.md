I know there are credentials in this repo. They will all be hidden as soon as this has a public port.

# Install Steps

Make sure you have Docker, docker-compose, and yarn installed. Links/instructions coming soon.

## Install command line tools necessary for development
    npm install -g @quasar/cli
    npm install -g ts-node-dev
    curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash

## Install packages
    cd server && yarn && cd ..
    cd client && yarn && cd ..

## Start docker containers in one terminal where you can see the logs
    docker-compose up

## Setup Hasura
    cd hasura && hasura migrate apply --endpoint  http://localhost:8002  --admin-secret mysecret && cd ..

## Run the app server and client in two terminals

### Client
    cd client && yarn run dev

Close localhost:8080

### App Server
    cd server && ts-node-dev src/index.ts

## Browse to

http://localhost:8000
http://localhost:8002
I know there are credentials in this repo. They will all be hidden as soon as this has a public port.

# Install Steps

Make sure you have Docker, docker-compose, and yarn installed. Links/instructions coming soon.

## Install command line tools and dependencies necessary for development
    make install

## Start docker containers in one terminal where you can see the logs
    docker-compose up

## Setup Hasura
    cd hasura && hasura migrate apply --endpoint  http://localhost:8002  --admin-secret mysecret && cd ..

# Dev env

I open 4 tabs and run the following commands

    make server
    make client
    make cleardb
    make migrate

## UIs

Databrary: http://localhost:8000
Hasura: http://localhost:8002
Minio: http://localhost:9000

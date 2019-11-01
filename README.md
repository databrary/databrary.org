I know there are credentials in this repo. They will all be hidden as soon as this has a public port.

# Install Steps

1. cd server && yarn && cd ..
1. cd client && yarn && cd ..
1. docker-compose up
1. cd hasura && hasura migrate apply --endpoint  http://localhost:8002  --admin-secret mysecret && cd ..

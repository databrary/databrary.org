#!/bin/bash
DOCKER_HOST_IP='host.docker.internal'

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    DOCKER_HOST_IP=$(ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')
fi

export DOCKER_HOST_IP=${DOCKER_HOST_IP}
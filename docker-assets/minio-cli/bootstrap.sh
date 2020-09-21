#!/bin/sh

mc config host add minio $MINIO_URL $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
mc admin config set minio/ notify_webhook:1 endpoint="http://${DOCKER_HOST_IP}:${PROXY_PORT}/minio/webhook" queue_dir="/events" queue_limit="10000"
mc admin service restart minio;
sleep 5
mc mb -p minio/uploads;
mc mb -p minio/cas;
mc mb -p minio/public;
mc policy set public minio/public;
mc event add minio/uploads arn:minio:sqs::1:webhook --event put
mc event add minio/cas arn:minio:sqs::1:webhook --event put
mc event add minio/public arn:minio:sqs::1:webhook --event put
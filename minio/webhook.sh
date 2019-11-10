mc config host add minio http://localhost:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
mc admin config get minio > minioconfig.json

"webhook": {
      "1": {
        "enable": true,
        "endpoint": "http://host.docker.internal:8000/webhooks/minio",
        "queueDir": "/events",
        "queueLimit": 10
      }
    }

mc admin config set minio < minioconfig.json
mc admin service restart minio

mc event add minio/uploads arn:minio:sqs::1:webhook --event put

mc event remove minio/uploads --force
mc event list minio/uploads

mc rm minio/uploads/dims.jpg
mc cp dims.jpg minio/uploads

docker exec -it databraryorg_minio_1 /bin/sh
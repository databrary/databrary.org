mc config host add minio http://localhost:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
mc admin config get minio > minioconfig.json

"webhook": {
      "1": {
        "enable": true,
        "endpoint": "http://localhost:9000/webhooks/minio",
        "queueDir": "/events",
        "queueLimit": 10000
      }
    }

mc admin config set minio < minioconfig.json
mc admin service restart minio
mc event add minio/2019 arn:minio:sqs::1:webhook --event put --suffix .jpg
mc event remove minio/2019 --force
mc event list minio/2019
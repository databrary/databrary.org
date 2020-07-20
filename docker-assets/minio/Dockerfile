FROM minio/mc:edge

COPY bootstrap.sh /usr/bin/bootstrap.sh
RUN chmod +x /usr/bin/bootstrap.sh
RUN command -v mc

ENTRYPOINT ["/usr/bin/bootstrap.sh"]

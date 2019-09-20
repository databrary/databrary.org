#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "postgres" -d "postgres"  <<-EOSQL
  CREATE DATABASE IF NOT EXISTS keycloak;
EOSQL


#!/usr/bin/env bash

# Stop all containers
echo "Stop all containers"
pwd
docker stop $(docker ps -a -q)

# Build the docker image
echo "Build the docker image"
cd docker || exit
pwd
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
cd ..

# Migrate the database
echo "Migrate the database"
cd frontend || exit
pwd
npm run migrate
cd ..

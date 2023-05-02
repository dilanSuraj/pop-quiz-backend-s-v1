#!/bin/bash

printenv
echo "----------------------------------------------------"
if [ "${GIT_BRANCH}" = "origin/master" ]; then
    echo "prod"
    docker-compose -f docker-compose.prod.yml up --build -d
else
    echo "stage"
    docker-compose -f docker-compose.stage.yml up --build -d
fi
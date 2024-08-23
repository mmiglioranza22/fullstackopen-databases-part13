#!/bin/bash

docker run -e POSTGRES_PASSWORD=admin -p 5432:5432 postgres && MY_CONTAINER=$(docker ps -aq) && docker exec -it $MY_CONTAINER psql -U postgres postgres
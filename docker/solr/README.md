# Solr

# Spin up a docker machine
docker-machine create --driver virtualbox --virtualbox-memory 8096 solrhost

# Connect docker to it
eval "$(docker-machine env solrhost)"


# Build Solr image from Dockerfile
docker build -t="ezeev/solr" .

# Run Solr from docker and attach
docker run -i -t -p 8983:8983 --name solr ezeev/solr bin/solr -f

# Run Solr from docker and detach
docker run -d -t -p 8983:8983 --name solr ezeev/solr bin/solr -f

# Run Solr from docker and detach, and link it to zookeeper (container named "zookeeper")
# must be running already
docker run -d -t -p 8983:8983 --link zookeeper:zookeeper --name solr ezeev/solr bin/solr -f

# Connect to an external ZK and run in cloud mode
docker run -d -t -p 8983:8983 --name solr01 ezeev/solr bin/solr -f -c -z 192.168.99.107:2181
docker run -d -t -p 8984:8983 --name solr02 ezeev/solr bin/solr -f -c -z 192.168.99.107:2181
docker run -d -t -p 8985:8983 --name solr03 ezeev/solr bin/solr -f -c -z 192.168.99.107:2181
docker run -d -t -p 8986:8983 --name solr04 ezeev/solr bin/solr -f -c -z 192.168.99.107:2181

## create a collection w/ 12 shards rf=2
docker exec -i -t solr bash
bin/solr create -c test -s 12 -rf 2

## Debugging

# Attach to the running instance
# Get the container ID from "docker ps"
docker attach solr
 
# Create a NEW shell to see what's going on inside
docker exec -i -t solr bash
 
 
 
 
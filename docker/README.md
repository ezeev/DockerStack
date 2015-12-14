## Host Setup
APP_NAME=homeapp
APP_PATH=/Users/evanpease/Development/homeapp

### Create The Host
docker-machine create --driver virtualbox --virtualbox-memory 8096 $APP_NAME

### Get The IP
HOST_IP=$(docker-machine ip $APP_NAME)

### Connect To It
eval "$(docker-machine env $APP_NAME)"

## Creating and Starting The Cluster

### Build Custom Images
docker build -f="zookeeper/Dockerfile" -t="ezeev/zookeeper" .
docker build -f="solr/Dockerfile" -t="ezeev/solr" .
docker build -f="nodejs/Dockerfile" -t="ezeev/node" .

### Start The Cluster
docker-compose up -d

#### Create Collection and Index Some Solr Docs
docker exec -it solr1 bin/solr create_collection -c collection1 -shards 2
docker exec -it solr1 bin/post -c collection1 example/exampledocs/*.xml

#### Docker UI
echo Open http://$HOST_IP:9000 in your browser to access $APP_NAME containers

#### HA Proxy Stats
http://$HOST_IP:90/

#### Viewing Solr
Go to http://$HOST_IP:9983/solr/collection1/select?q=*:*&shards.info=true
shards.info=true shows us that the docs were distributed accross both solr nodes.

## Attach to a container
docker exec -i -t <container> bash





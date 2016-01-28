## Host Setup
APP_NAME=$1

echo Creating docker host: $APP_NAME
### Create The Host
docker-machine create --driver virtualbox --virtualbox-memory 8096 $APP_NAME
### Get The IP
HOST_IP=$(docker-machine ip $APP_NAME)

eval "$(docker-machine env $APP_NAME)"

echo Docker host $APP_NAME has been created at $HOST_IP

echo Building custom images.

docker build -f="zookeeper/Dockerfile" -t="ezeev/zookeeper" .
docker build -f="solr/Dockerfile" -t="ezeev/solr" .
docker build -f="nodejs/Dockerfile" -t="ezeev/node" .
docker build -f="wavefront/Dockerfile" -t="ezeev/wavefront" .
docker build -f="statsd/Dockerfile" -t="ezeev/statsd" .

echo Starting containers.

docker-compose up -d

echo containers started.

echo waiting 5 seconds...
sleep 5
echo Creating a 2 shard Solr collection.
docker exec -it solr1 bin/solr create_collection -c collection1 -shards 2
echo Indexing sample documents.
docker exec -it solr1 bin/post -c collection1 example/exampledocs/manufacturers.xml
echo Go to http://$HOST_IP:9983/solr/collection1/select?q=*:*&shards.info=true to see distributed data

echo To stop containers, run:
echo docker-compose stop
echo To bring containers back up, run:
echo docker-compose up -d
echo See docker compose documentation for further information.

echo Go to http://$HOST_IP:9000 in your browser to access the Docker UI.
echo "Go to http://$HOST_IP:9000/#/containers_network in your browser to view networking."
echo "Go to http://$HOST_IP:90 to view HA Proxy Stats"
echo "Go to http://$HOST_IP:9983 to access load balanced Solr endpoint."
echo "Go to http://$HOST_IP to access load balanced NGINX endpoint."
### Connect To It
#eval "$(docker-machine env $APP_NAME)"

docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:rw \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=8080:8080 \
  --detach=true \
  --name=cadvisor \
  google/cadvisor:latest \
  -storage_driver=statsd \
  -storage_driver_host=192.168.99.100:8125 \
  -storage_driver_db=docker_node_001

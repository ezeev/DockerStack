
## Docker Stack

Create a distributed datacenter on your local machine using Docker containers. This repo is a starting point for building distributed apps using an array of different networked services

Current containers include:
- 1 HA Proxy (load balancing)
- 2 NGINX (web serving)
- 2 Solr (search service)
- 3 Zookeeper (cluster brain/coordinator)
- 1 DockerUI (container visualization)

HA Proxy provides load balancing to the NGINX and Solr nodes.

### Setup

A setup script is provided in the docker directory. This script will create an 8 GB host, build and start all containers.
```
cd docker
bash setup.sh APP_NAME
```
Replace APP_NAME with the name of your application. 

When the script is complete it will provide URLs with more information about the cluster:
```
Go to http://192.168.99.100:9000 in your browser to access the Docker UI.
Go to http://192.168.99.100:9000/#/containers_network in your browser to view networking.
Go to http://192.168.99.100:90 to view HA Proxy Stats
Go to http://192.168.99.100:9983 to access load balanced Solr endpoint.
Go to http://192.168.99.100 to access load balanced NGINX endpoint.
Go to http://192.168.99.100:9983/solr/collection1/select?q=*:*&shards.info=true to see sample distributed data.
```

After setup.sh has been run, you can start or stop the cluster using docker-compose
```
docker-compose stop
docker-compose up -d
```


### Roadmap
- Nodejs
- Cassandra



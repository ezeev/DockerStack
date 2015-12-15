
## Docker Stack

Create a distributed datacenter on your local machine using Docker containers. This repo is a starting point for building distributed apps using an array of different networked service

Current containers include:
- 1 HA Proxy (load balancing)
- 2 NGINX (web serving)
- 2 Solr (search service)
- 3 Zookeeper (cluster brain/coordinator)
- 1 DockerUI (container visualization)

HA Proxy provides load balancing to the NGINX and Solr nodes.

### Roadmap
- Nodejs
- Cassandra



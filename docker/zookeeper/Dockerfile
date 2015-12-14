# ZooKeeper
FROM java:openjdk-8-jre

MAINTAINER Evan Pease: 0.1

#RUN mkdir -p /opt/zookeeper

WORKDIR /opt

RUN curl -o zk.tgz http://www.eu.apache.org/dist/zookeeper/zookeeper-3.4.7/zookeeper-3.4.7.tar.gz

RUN tar xf zk.tgz

RUN mv /opt/zookeeper-3.4.7/ /opt/zookeeper/

WORKDIR /opt/zookeeper

RUN cp /opt/zookeeper/conf/zoo_sample.cfg /opt/zookeeper/conf/zoo.cfg

EXPOSE 2181 2888 3888

ENTRYPOINT ["/opt/zookeeper/bin/zkServer.sh"]
CMD ["start-foreground"]
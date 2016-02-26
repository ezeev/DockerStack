#Cassandra

#FROM java:openjdk-8-jre
FROM ubuntu

MAINTAINER Evan Pease: 0.1

RUN apt-get install curl -y

RUN mkdir /opt/cassandra

WORKDIR /opt/cassandra

RUN curl -L http://apache.arvixe.com/cassandra/3.2.1/apache-cassandra-3.2.1-bin.tar.gz | tar xz

WORKDIR /opt/cassandra/dsc-cassandra-2.1.5

CMD ["bin/cassandra","-f"]
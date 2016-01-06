#Cassandra

FROM java:openjdk-8-jre

MAINTAINER Evan Pease: 0.1

RUN mkdir /opt/cassandra
WORKDIR /opt/cassandra

RUN curl -L http://downloads.datastax.com/community/dsc-cassandra-2.1.5-bin.tar.gz | tar xz

WORKDIR /opt/cassandra/dsc-cassandra-2.1.5

CMD ["bin/cassandra","-f"]
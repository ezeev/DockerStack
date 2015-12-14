# SOLR
FROM java:openjdk-8-jre

MAINTAINER Evan Pease: 0.1

RUN mkdir -p /opt/solr

WORKDIR /opt/solr

RUN curl -o solr.tgz http://www.eu.apache.org/dist/lucene/solr/5.3.1/solr-5.3.1.tgz

RUN tar xf solr.tgz

EXPOSE 8983
WORKDIR /opt/solr/solr-5.3.1/

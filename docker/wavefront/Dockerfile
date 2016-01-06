# Wavefront proxy and Collectd
FROM ubuntu

MAINTAINER Evan Pease: 0.1

RUN apt-get install curl -y

RUN bash -c "$(curl -sL https://goo.gl/c70QCx)" -h --proxy --server https://metrics.wavefront.com/api/ --token 393b1cc3-15ac-485b-b635-1ab7f8a2a2c3 --collectd --proxy_address localhost --proxy_port 4242 --overwrite_collectd_config

RUN service collectd stop
RUN service wavefront-proxy stop


EXPOSE 3878
EXPOSE 2878
EXPOSE 4242

#CMD ["tail","-f","/var/log/wavefront.log"]
CMD service wavefront-proxy start && service collectd start && tail -f /var/log/wavefront.log


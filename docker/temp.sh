#!/bin/sh

HOST_IP=$(docker-machine ip homeapp)
APP_PATH=/Users/evanpease/Development/homeapp

echo Open http://$HOST_IP in your browser.

sed -i -e "s/\[IP_ADDRESS\]/$HOST_IP/g" $APP_PATH/web/index.html


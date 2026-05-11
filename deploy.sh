#!/bin/bash

tar xvf dist.tar.xz
mkdir -p /data/nginx/www/blood
find /data/nginx/www/blood -mindepth 1 ! -name index.html -exec rm -rf {} +
mv dist/index.html /data/nginx/www/blood/index.html
rm -rf dist
rm -f dist.tar.xz

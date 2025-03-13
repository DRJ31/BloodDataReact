#!/bin/bash

tar xvf dist.tar.xz
rm -rf /data/nginx/www/blood
mv dist /data/nginx/www/blood
rm -f dist.tar.xz

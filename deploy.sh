#!/bin/bash

tar xvf build.tar.xz
rm -rf /data/nginx/www/blood
mv build /data/nginx/www/blood
rm -f build.tar.xz

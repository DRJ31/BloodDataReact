#!/bin/bash

tar xvf build.tar.xz
sudo rm -rf /var/www/blood
sudo mv build /var/www/blood

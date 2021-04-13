#!/bin/bash

tar xvf public.tar.xz
sudo rm -rf /var/www/blood
sudo mv public /var/www/blood
sudo chown -R www-data:www-data /var/www/blood

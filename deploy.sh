#!/bin/bash

tar xvf public.tar.xz
sudo mv public /var/www/blood
sudo chown -R www-data:www-data /var/www/blood

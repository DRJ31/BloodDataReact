#!/bin/bash

tar xvf build.tar.xz
echo $PASSWORD | sudo -S rm -rf /var/www/blood
sudo mv build /var/www/blood
sudo chown -R www-data:www-data /var/www/blood

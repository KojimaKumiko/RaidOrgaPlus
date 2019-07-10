#!/bin/sh
git reset --hard
git pull
npm run install
npm run build

rm -r /var/www/html
mv frontend/dist /var/www/html
service apache2 restart

screen -S backend -X quit
screen -d -m -S backend bash -c 'npm run start-backend'

screen -S discord -X quit
screen -d -m -S discord bash -c 'npm run start-discord'

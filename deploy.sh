#!/bin/sh

# todaysDate=$(date +"%m-%d-%Y")

# exec > /home/pi/workspace/lights/logs/${todaysDate}.log
# exec 2>&1

npm install --prefix ./client

npm run build --prefix ./client

npm install --prefix ./server

npm run build --prefix ./server

cp ./light-control.service /etc/systemd/system

systemctl daemon-reload

systemctl stop light-control.service
systemctl start light-control.service
systemctl enable light-control.service

# sudo bash deploy.sh
#!/bin/sh

# todaysDate=$(date +"%m-%d-%Y")

# exec > /home/pi/workspace/lights/logs/${todaysDate}.log
# exec 2>&1

echo "building client"

npm install --prefix ./client

npm run build --prefix ./client

echo "building server"

npm install --prefix ./server

npm run build --prefix ./server

echo "creating light control service"

cp ./light-control.service /etc/systemd/system

systemctl daemon-reload

echo "restart light control service"

systemctl stop light-control.service
systemctl start light-control.service
systemctl enable light-control.service

echo "killing loki container"
docker kill loki-container

echo "killing promtail container"
docker kill promtail-container

echo "spinning up containers"
docker-compose up -d

# sudo bash deploy.sh
#!/bin/sh

# todaysDate=$(date +"%m-%d-%Y")

# exec > /home/pi/workspace/lights/logs/${todaysDate}.log 
# exec 2>&1

npm install --prefix /home/pi/workspace/lights/client

npm run build --prefix /home/pi/workspace/lights/client

npm install --prefix /home/pi/workspace/lights/server

npm run build --prefix /home/pi/workspace/lights/server

node /home/pi/workspace/lights/server/build/server/src/index.js

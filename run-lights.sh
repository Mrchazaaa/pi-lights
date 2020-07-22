#!/bin/sh

# todaysDate=$(date +"%m-%d-%Y")

# exec > /home/pi/workspace/lights/logs/${todaysDate}.log 
# exec 2>&1

node /home/pi/workspace/lights/server/src/index.js
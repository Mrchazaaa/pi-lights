# Pi Lights
[![Build Status](https://travis-ci.com/Mrchazaaa/pi-lights.svg?branch=master)](https://travis-ci.com/Mrchazaaa/pi-lights)
[![codecov](https://codecov.io/gh/Mrchazaaa/pi-lights/branch/master/graph/badge.svg?token=7SV384HJIL)](https://codecov.io/gh/Mrchazaaa/pi-lights)

A linux service running on a Raspberry Pi kept in my room (pictured below). The Pi continuously polls a series of light dependent resistors, averaging the readings of each sensor, effectively tracking light levels of the room throughout the day. When the light level crosses a certain threshold the room's Wi-Fi lights are turned on/off.

![Alt text](pi.jpg?raw=true "Pi Circuitry")

Below, you'll find a video demonstration of the lights at work.

<a href='https://www.youtube.com/watch?v=ZpO6WK41Bb8&ab_channel=Mrchazaaa "Lights Demonstration"'><image src="./videoImage.png"></a>

As the project has grown it has come to encompass a wider range of home automation functionality, including:
* Alexa welcome message on arrival.
* Automatic lights-out timer.

To help with debuggng, the Pi includes a web server, built with Express, which serves a React based client displaying day-to-day system logs and light level graphs. A typical light level graph is included below (the blips represent dark conditions simulated for testing, by covering the sensors with an old hat).

<image src="./graph.png" style="float: right;">
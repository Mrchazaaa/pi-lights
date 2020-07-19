var lights = require('./lights/lights');
var sensor = require('./sensor/sensor');

var lightsOn = {};

function log(message) {
    console.log(`[LightController] ${message}`);
}

async function runDeviceLoop(device) {
	try
	{
		if (lightsOn[device._address] == undefined) {
			lightsOn[device._address] = await lights.areLightsOn(device);
		}

		switch(await sensor.isDark()) {
			case true:
				log('it is dark');
				
				if (!lightsOn[device._address]) {
					await lights.turnOn(device);
					lightsOn[device._address] = await lights.areLightsOn(device); // SHOULD be true
				}
				break;
			case false:
				log('it is not dark');

				if (lightsOn[device._address]) {
					await lights.turnOff(device);
					lightsOn[device._address] = await lights.areLightsOn(device); // SHOULD be false
				}
			break;
		}
	}
	catch(e) {
		log(`could not connect to ${device._address}, removing.`);
		delete devicesById[device._address];
	}
}

var devicesById = {};

async function pollSensors(baseDataFilePath) {
	sensor.setDataDirectory(baseDataFilePath);

	while(true) {
		var deviceKeys = Object.keys(devicesById);

		switch(deviceKeys.length) {
			case 0:
				log('found no devices.');
				devicesById = await lights.discoverDevices();
				break;
			case 1:
				log(`found 1 device.`);
				await runDeviceLoop(devicesById[deviceKeys[0]]);
				devicesById = await lights.discoverDevices();
				break;
			case 2:
				log(`found 2 devices.`);
				await runDeviceLoop(devicesById[deviceKeys[0]]);
				await runDeviceLoop(devicesById[deviceKeys[1]]);
				break;
		}
	}
}

module.exports = {
    pollSensors,
}
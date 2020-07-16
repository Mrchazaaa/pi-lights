require('log-timestamp') // prepends UTC timestamp to log messages
var lights = require('./lights/lights');
var sensor = require('./sensor/sensor');

var threshhold = 1400;
var lightsOn = {};

async function run(device) {
	try
	{
		// lower value means the detected light is bright 
		var isDark = (threshhold - await sensor.getLightLevel()) <= 0;

		if (lightsOn[device._address] == undefined) {
			lightsOn[device._address] = await lights.areLightsOn(device);
		}

		switch(isDark) {
			case true:
				console.log('it is dark');
				
				if (!lightsOn[device._address]) {
					await lights.turnOn(device);
					lightsOn[device._address] = await lights.areLightsOn(device); // SHOULD be true
				}
				break;
			case false:
				console.log('it is not dark');

				if (lightsOn[device._address]) {
					await lights.turnOff(device);
					lightsOn[device._address] = await lights.areLightsOn(device); // SHOULD be false
				}
			break;
		}
	}
	catch(e) {
		console.log(`could not connect to ${device._address}, removing.`);
		delete devicesById[device._address];
	}
}

// // test sensor output
// (async () => {
// 	while(true) {
// 		console.log(await sensor.getLightLevel());	
// 	}
// })();

var devicesById = {};

(async () => {
	while(true) {
		var deviceKeys = Object.keys(devicesById);

		switch(deviceKeys.length) {
			case 0:
				console.log('found no devices.');
				devicesById = await lights.discoverDevices();
				break;
			case 1:
				console.log(`found 1 device.`);
				await run(devicesById[deviceKeys[0]]);
				devicesById = await lights.discoverDevices();
				break;
			case 2:
				console.log(`found 2 devices.`);
				await run(devicesById[deviceKeys[0]]);
				await run(devicesById[deviceKeys[1]]);
				break;
		}
	}
})();
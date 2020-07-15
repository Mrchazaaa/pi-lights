var lights = require('./lights/lights');
var sensor = require('./sensor/sensor');

var threshhold = 3000;
var lightsOn = [undefined, undefined];

async function run(device) {
	// lower value means the detected light is bright 
	var isDark = (threshhold - await sensor.getLightLevel()) <= 0;

	while (lightsOn[0] == undefined || lightsOn[1] == undefined) {
		lightsOn = await lights.areLightsOn(device);
	}

	switch(isDark) {
		case true:
			if (!lightsOn) {
				await lights.turnOn(device);
				lightsOn = await lights.areLightsOn(device); // SHOULD be true
			}
			break;
		case false:
			if (lightsOn) {
				await lights.turnOff(device);
				lightsOn = await lights.areLightsOn(device); // SHOULD be false
			}
		break;
	}
}

// // test sensor output
// (async () => {
// 	while(true) {
// 		console.log(await sensor.getLightLevel());	
// 	}
// })();

(async () => {
	var deviceById = {};

	while(true)
		if (Object.keys(deviceById).length < 2) {
			deviceById = await lights.discoverDevices();
		} else {
			Object.values(deviceById).forEach(async device => await run(device));
		}
})();
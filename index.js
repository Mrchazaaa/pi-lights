var lights = require('./lights/lights');
var sensor = require('./sensor/sensor');

var threshhold = 3000;
var lightsOn = [undefined, undefined];

async function run() {
	// lower value means the detected light is bright 
	var isDark = (threshhold - await sensor.getLightLevel()) <= 0;

	while (lightsOn[0] == undefined || lightsOn[1] == undefined) {
		lightsOn = await lights.getLightsOn();
	}

	switch(isDark) {
		case true:
			if (!lightsOn) {
				await lights.turnOn();
				lightsOn = await lights.getLightsOn(); // SHOULD be true
			}
			break;
		case false:
			if (lightsOn) {
				await lights.turnOff();
				lightsOn = await lights.getLightsOn(); // SHOULD be false
			}
		break;
	}
}

(async () => {
	while(true) {
		console.log(await sensor.getLightLevel());	
	}
})();

// lights.initialize().then(async () => {
// 	var a = await lights.turnOff();

// 	console.log(a);
// });

// lights.initialize().then(async () => {	
// 	while(lights.getDevices().length != 0) {
// 		await run();
// 	}

// 	console.log("exiting, no lights found");
// });
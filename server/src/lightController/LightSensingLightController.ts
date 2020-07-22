import LoggerFactory from '../logging/WinstonLoggerFactory';
import ILogger from '../logging/ILogger'
import LightsManager from './lights/LightsManager';
import Light from './lights/Light';
import { LightState } from './lights/LightState';
var lights = require('./lights/lights');
var sensor = require('./sensor/sensor');

export default class LightSensingLightController {
	
	private logger: ILogger;
	private lightsManager: LightsManager;
	
	constructor(baseDataFilePath: string) {
		this.logger = LoggerFactory.createLogger(LightSensingLightController.constructor.name);
		this.lightsManager = new LightsManager();
	}

	private async run() {

		while(true) {
			if (!this.lightsManager.areAllLightsDiscovered) {
				this.lightsManager.discoverDevices();
			}

			this.lightsManager.getLights().forEach(async (device: Light) => await this.runControlLoop(device));
		}
	}

	private async runControlLoop(light: Light) : Promise<void> {
		try
		{
			if (light.haveLightsBeenTurnedOn() == LightState.Unknown) {
				await light.areLightsOn();
			}

			switch(await sensor.isDark()) {
				case true:
					this.logger.info('it is dark');
					
					if (light.haveLightsBeenTurnedOn() == LightState.Off) {
						await lights.turnOn();
					}
					break;
				case false:
					this.logger.info('it is not dark');

					if (light.haveLightsBeenTurnedOn() == LightState.On) {
						await lights.turnOff();
					}
				break;
			}
		}
		catch(e) {
			this.logger.info(`could not connect to ${light.address}.`);
			this.logger.error(e);
			// delete devicesById[light._address];
		}
	}
}
import LoggerFactory from '../logging/WinstonLoggerFactory';
import ILogger from '../logging/ILogger'
import LightsManager from './lights/LightsManager';
import Light from './lights/Light';
import { LightState } from './lights/LightState';
import AveragingLightSensorsManager from './sensor/AveragingLightSensorsManager';

export default class LightSensingLightController {

	private logger: ILogger;
	private lightsManager: LightsManager;
	private lightSensorsManager: AveragingLightSensorsManager;

	constructor() {
		this.logger = LoggerFactory.createLogger(LightSensingLightController.constructor.name);
		this.lightsManager = new LightsManager();
		this.lightSensorsManager = new AveragingLightSensorsManager();
	}

	public async run() {

		while(true) {
			if (!this.lightsManager.areAllLightsDiscovered()) {
				await this.lightsManager.discoverDevices();
			}

			this.lightsManager.getLights().forEach(
				async (device: Light) => await this.runControlLoop(device));
		}
	}

	private async runControlLoop(light: Light) : Promise<void> {
		try
		{
			if (light.haveLightsBeenTurnedOn() === LightState.Unknown) {
				await light.areLightsOn();
				this.logger.info(`Initializing light state cache for ${light.address}, haveLightsBeenTurnedOn: ${light.haveLightsBeenTurnedOn()}.`);
			}

			switch(await this.lightSensorsManager.isDark()) {
				case true:
					this.logger.info('it is dark');

					if (light.haveLightsBeenTurnedOn() === LightState.Off) {
						await light.turnOn();
					}
					break;
				case false:
					this.logger.info('it is not dark');

					if (light.haveLightsBeenTurnedOn() === LightState.On) {
						await light.turnOff();
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
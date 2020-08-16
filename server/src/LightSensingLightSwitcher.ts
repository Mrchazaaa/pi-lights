import LoggerProvider from './Logging/LoggerProvider';
import ILogger from './Logging/ILogger'
import ILightsManager from './Controllers/Lights/ILightsManager';
import LightState from './Controllers/Lights/LightState';
import IAveragingLightSensorsManager from './Sensors/LightSensor/IAveragingLightSensorsManager';
import ILightSensingLightSwitcher from './ILightSensingLightSwitcher';
import ILight from './Controllers/Lights/ILight';

export default class LightSensingLightSwitcher implements ILightSensingLightSwitcher {

	private logger: ILogger;
	private lightsManager: ILightsManager;
	private lightSensorsManager: IAveragingLightSensorsManager;
	private shouldControlLoopRun: boolean;

	constructor(lightsManager: ILightsManager, averageLightSensorsManager: IAveragingLightSensorsManager) {
		this.logger = LoggerProvider.createLogger(LightSensingLightSwitcher.constructor.name);
		this.lightsManager = lightsManager;
		this.lightSensorsManager = averageLightSensorsManager;
		this.shouldControlLoopRun = false;
	}

	public cancelControlLoop() {
		this.logger.info("Stopping control loop.");
		this.shouldControlLoopRun = false;
	}
	
	public async runControlLoopAsync() {
		this.logger.info("Running control loop.");
		this.shouldControlLoopRun = true;

		while(this.shouldControlLoopRun) {
			if (!this.lightsManager.areAllLightsDiscovered()) {
				await this.lightsManager.discoverDevices();
			}

			this.lightsManager.getLights().forEach(
				async (light: ILight) => await this.controlLightAsync(light));
		}
	}

	private async controlLightAsync(light: ILight) : Promise<void> {
		try
		{
			if (light.cachedOnstate() === LightState.Unknown) {
				await light.areLightsOnAsync();
				this.logger.info(`Initializing light state cache for ${light.address}, haveLightsBeenTurnedOn: ${light.cachedOnstate()}.`);
			}

			switch(await this.lightSensorsManager.isDarkAsync()) {
				case true:
					this.logger.info('it is dark');

					if (light.cachedOnstate() === LightState.Off) {
						await light.turnOnAsync();
					}
					break;
				case false:
					this.logger.info('it is not dark');

					if (light.cachedOnstate() === LightState.On) {
						await light.turnOffAsync();
					}
				break;
			}
		}
		catch(e) {
			this.logger.info(`could not connect to ${light.address}.`);
			this.logger.error(e);
		}
	}
}
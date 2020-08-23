import LoggerProvider from './Logging/LoggerProvider';
import ILogger from './Logging/ILogger'
import ILightsManager from './Controllers/Lights/ILightsManager';
import LightState from './Controllers/Lights/LightState';
import ILightSensingLightSwitcher from './ILightSensingLightSwitcher';
import ILight from './Controllers/Lights/ILight';
import ISensor from './Sensors/ISensor';

export default class LightSensingLightSwitcher implements ILightSensingLightSwitcher {

	private logger: ILogger;
	private lightsManager: ILightsManager;
	private meanSensorFilter: ISensor;
    private shouldControlLoopRun: boolean;
    private lightThreshold: number;

	constructor(lightsManager: ILightsManager, meanSensorFilter: ISensor, lightThreshold: number) {
		this.logger = LoggerProvider.createLogger(LightSensingLightSwitcher.constructor.name);
		this.lightsManager = lightsManager;
		this.meanSensorFilter = meanSensorFilter;
        this.lightThreshold = lightThreshold;
        this.shouldControlLoopRun = false;
	}

	public cancelControlLoop() {
		this.logger.info('Stopping control loop.');
		this.shouldControlLoopRun = false;
	}

	public async runControlLoopAsync() {
		this.logger.info('Running control loop.');
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
			if (light.getCachedOnState() === LightState.Unknown) {
				await light.areLightsOnAsync();
				this.logger.info(`Initializing light state cache for ${light.address}, haveLightsBeenTurnedOn: ${light.getCachedOnState()}.`);
			}

			if (await this.isDarkAsync()) {
				this.logger.info('it is dark');

				if (light.getCachedOnState() === LightState.Off) {
					await light.turnOnAsync();
				}
			} else {
				this.logger.info('it is not dark');

				if (light.getCachedOnState() === LightState.On) {
					await light.turnOffAsync();
				}
			}
		}
		catch(e) {
			this.logger.info(`could not connect to ${light.address}.`);
			this.logger.error(e);
		}
    }
    
    private async isDarkAsync(): Promise<boolean> {
        return (this.lightThreshold - (await this.meanSensorFilter.getReadingAsync())) <= 0;
    }
}
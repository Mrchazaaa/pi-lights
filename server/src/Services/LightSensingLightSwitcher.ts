import LoggerProvider, { IDataLogger, ILogger } from '../Logging/LoggerProvider';
import ILightsManager from '../Controllers/Lights/ILightsManager';
import LightState from '../Controllers/Lights/LightState';
import ILightSensingLightSwitcher from './ILightSensingLightSwitcher';
import ILight from '../Controllers/Lights/ILight';
import ISensor from '../Sensors/ISensor';

export default class LightSensingLightSwitcher implements ILightSensingLightSwitcher {
	private logger: ILogger;
	private dataLogger: IDataLogger;
	private lightsManager: ILightsManager;
	private lightSensor: ISensor<number>;
    private lightThreshold: number;

	constructor(lightsManager: ILightsManager, lightSensor: ISensor<number>, lightThreshold: number) {
		this.logger = LoggerProvider.createLogger(LightSensingLightSwitcher.name);
		this.dataLogger = LoggerProvider.createDataLogger();
		this.lightsManager = lightsManager;
		this.lightSensor = lightSensor;
        this.lightThreshold = lightThreshold;
    }

	public async runControlLoop(): Promise<void> {
        this.logger.info('Running control loop.');

        const threshold = await this.getLightThreshold();

        await this.lightsManager.discoverDevicesAsync();
        await Promise.all(this.lightsManager.getLights().map(light => this.controlLightAsync(light, threshold)));
	}

	private async controlLightAsync(light: ILight, threshold: number) : Promise<void> {
        this.logger.info(`Controlling light ${light.address}.`);

		try
		{
			if (light.getCachedOnState() === LightState.Unknown) {
				await light.updateStateCacheAsync();
				this.logger.info(`Initializing light state cache for ${light.address}, as '${light.getCachedOnState()}'.`);
			}

			if (await this.isDarkAsync(threshold)) {
				this.logger.info('It is dark.');

				if (light.getCachedOnState() === LightState.Off) {
                    await light.setAmbientAsync();
				}
			} else {
				this.logger.info('It is not dark.');

				if (light.getCachedOnState() === LightState.On) {
					await light.turnOffAsync();
				}
			}
		}
		catch(error) {
			this.logger.error(`Error occured while controlling ${light.address}.`);
            this.logger.error(error.toString());
            this.lightsManager.removeLight(light.address);
		}
    }

    private async isDarkAsync(threshold: number): Promise<boolean> {
        this.logger.info(`Reading new light level.`);
        const reading = (await this.lightSensor.getReadingAsync());
        this.logger.info(`Read new light level '${reading}'.`);
        await this.dataLogger.logLux(reading, threshold);
        return (threshold - reading) >= 0;
    }

    private async getLightThreshold(): Promise<number> {
        const offset = this.lightsManager.getLights().every(l => l.getCachedOnState() === LightState.On) ? 1 : 0;
        const threshold = this.lightThreshold + offset;
        await this.dataLogger.logThreshold(threshold);
        return threshold;
    }

    public dispose(): void {
        this.logger.info('Disposing.');
        this.lightSensor.dispose();
    }
}

export { ILightSensingLightSwitcher };

import LoggerProvider, { IDataLogger, ILogger } from '../Logging/LoggerProvider';
import ILightsManager from '../Controllers/Lights/ILightsManager';
import LightState from '../Controllers/Lights/LightState';
import ILightSensingLightSwitcher from './ILightSensingLightSwitcher';
import ILight from '../Controllers/Lights/ILight';
import ISensor from '../Sensors/ISensor';

interface TLightData {
    ambient: number
}

export default class LightSensingLightSwitcher implements ILightSensingLightSwitcher {
	private logger: ILogger;
	private dataLogger: IDataLogger;
	private lightsManager: ILightsManager;
	private lightSensor: ISensor<TLightData>;
    private lightThreshold: number;

	constructor(lightsManager: ILightsManager, lightSensor: ISensor<TLightData>, lightThreshold: number) {
		this.logger = LoggerProvider.createLogger(LightSensingLightSwitcher.name);
		this.dataLogger = LoggerProvider.createDataLogger();
		this.lightsManager = lightsManager;
		this.lightSensor = lightSensor;
        this.lightThreshold = lightThreshold;
    }

	public async runControlLoop(): Promise<void> {
        this.logger.info('Running control loop.');

        await this.lightsManager.discoverDevicesAsync();
        await Promise.all(this.lightsManager.getLights().map(light => this.controlLightAsync(light)));
	}

	private async controlLightAsync(light: ILight) : Promise<void> {
        this.logger.info(`Controlling light ${light.address}.`);

		try
		{
			if (light.getCachedOnState() === LightState.Unknown) {
				await light.updateStateCacheAsync();
				this.logger.info(`Initializing light state cache for ${light.address}, as '${light.getCachedOnState()}'.`);
			}

			if (await this.isDarkAsync()) {
				this.logger.info('It is dark.');

				if (light.getCachedOnState() === LightState.Off) {
					await light.turnOnAsync();
				}
			} else {
				this.logger.info('It is not dark.');

				if (light.getCachedOnState() === LightState.On) {
					await light.turnOffAsync();
				}
			}
		}
		catch(error) {
			this.logger.error(`Could not connect to ${light.address}.`);
            this.logger.error(error.toString());
            this.lightsManager.removeLight(light.address);
		}
    }

    private async isDarkAsync(): Promise<boolean> {
        this.logger.info(`Reading new light level.`);
        const reading = (await this.lightSensor.getReadingAsync()).ambient;
        this.logger.info(`Read new light level '${reading}'.`);
        this.dataLogger.log(reading);
        return (this.lightThreshold - reading) >= 0;
    }

    public dispose(): void {
        this.logger.info('Disposing.');
        this.lightSensor.dispose();
    }
}

export { ILightSensingLightSwitcher };
import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import ILightsManager from './ILightsManager';
import ILightFactory, { ILight } from './ILightFactory';
import { Discovery, IDeviceOptions } from 'magic-home';

export default class LightsManager implements ILightsManager {

	private logger: ILogger;
    private lightsCache: {[index:string]: ILight} = {};
    private discoveryTimeout: number;
    private maxLights: number;
    private lightFactory: ILightFactory;

    constructor(discoveryTimeout: number, numberOfLights: number, lightFactory: ILightFactory) {
        this.logger = LoggerProvider.createLogger(LightsManager.constructor.name);
        this.discoveryTimeout = discoveryTimeout;
        this.maxLights = numberOfLights;
        this.lightFactory = lightFactory;
    }

    public async discoverDevices(): Promise<void> {
        this.logger.info('Discovering devices.');

        (await Discovery.scan(this.discoveryTimeout)).forEach((deviceOptions: IDeviceOptions) => {
            const light = this.lightFactory.createLight(deviceOptions.address);
            this.lightsCache[deviceOptions.address] = light;
        });

        this.logger.info(`discovered: ${Object.keys(this.lightsCache)}`);
    }

    public getLights(): ILight[] {
        return Object.values(this.lightsCache);
    }

    public areAllLightsDiscovered(): boolean {
        return Object.keys(this.lightsCache).length === this.maxLights;
    }
}

export { ILightsManager };
import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import ILightsManager from './ILightsManager';
import ILightFactory, { ILight } from './ILightFactory';
import { Discovery, IDeviceOptions } from 'magic-home';
import RateLimitedOperation from '../../Utilities/RateLimitedOperation';

export default class LightsManager implements ILightsManager {
	private logger: ILogger;
    private lightsCache: {[index:string]: ILight} = {};
    private discoveryTimeout: number;
    private maxLights: number;
    private lightFactory: ILightFactory;
    private discoveryOperation: RateLimitedOperation<Promise<void>>;

    constructor(discoveryRateLimit: number, numberOfLights: number, lightFactory: ILightFactory) {
        this.logger = LoggerProvider.createLogger(LightsManager.name);
        this.discoveryTimeout = discoveryRateLimit;
        this.maxLights = numberOfLights;
        this.lightFactory = lightFactory;
        this.discoveryOperation = new RateLimitedOperation<Promise<void>>(
            this.doDiscoverDevicesAsync.bind(this),
            discoveryRateLimit);
    }

    public async discoverDevicesAsync(): Promise<void> {
        this.logger.info('Discovering devices.');

        if (this.maxLights === Object.keys(this.lightsCache).length) {
            return;
        }

        return this.discoveryOperation.execute();
    }

    public getLights(): ILight[] {
        return Object.values(this.lightsCache);
    }

    public areAllLightsDiscovered(): boolean {
        this.logger.info('Verifying if all lights have been discovered.');
        return Object.keys(this.lightsCache).length === this.maxLights;
    }

    public removeLight(lightAddress: string) {
        delete this.lightsCache[lightAddress];
    }

    private async doDiscoverDevicesAsync(): Promise<void> {
        (await Discovery.scan(this.discoveryTimeout)).forEach((deviceOptions: IDeviceOptions) => {
            if (this.lightsCache[deviceOptions.address] === undefined) {
                this.logger.info(`Discovered: ${deviceOptions.address}`);
                const light = this.lightFactory.createLight(deviceOptions.address);
                this.lightsCache[deviceOptions.address] = light;
            }
        });
    }
}

export { ILightsManager, ILight };
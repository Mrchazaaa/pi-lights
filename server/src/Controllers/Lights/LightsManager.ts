import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import ILightsManager from './ILightsManager';
import ILightFactory, { ILight } from './ILightFactory';
import { Discovery, IDeviceOptions } from 'magic-home';
import { getTimeInMilliseconds } from '../../../src/TimingHelper';

export default class LightsManager implements ILightsManager {

	private logger: ILogger;
    private lightsCache: {[index:string]: ILight} = {};
    private discoveryTimeout: number;
    private maxLights: number;
    private lightFactory: ILightFactory;
    private discoveryInvocationTimeout: number;
    private discoveryPromise: Promise<void> | null;
    private discoveryThresholdTimeout: NodeJS.Timeout | null;
    private lastDiscoveryTimestamp: number | null;

    constructor(discoveryTimeout: number, discoveryInvocationTimeout: number, numberOfLights: number, lightFactory: ILightFactory) {
        this.logger = LoggerProvider.createLogger(LightsManager.name);
        this.discoveryTimeout = discoveryTimeout;
        this.maxLights = numberOfLights;
        this.lightFactory = lightFactory;
        this.discoveryInvocationTimeout = discoveryInvocationTimeout;
        this.discoveryPromise = null;
        this.discoveryThresholdTimeout = null;
        this.lastDiscoveryTimestamp = null;
    }

    public async discoverDevicesAsync(): Promise<void> {
        this.logger.info('Discovering devices.');

        if (this.maxLights === Object.keys(this.lightsCache).length) {
            return;
        }

        if (!this.lastDiscoveryTimestamp) {
            this.lastDiscoveryTimestamp = getTimeInMilliseconds();
        }

        const timeSinceLastInvocation = getTimeInMilliseconds() - this.lastDiscoveryTimestamp;
        if (timeSinceLastInvocation > this.discoveryInvocationTimeout) {
            this.logger.info(`Clearing cached discovery after ${timeSinceLastInvocation} ms.`);
            this.discoveryPromise = null;
        }

        if (this.discoveryPromise === null) {
            this.logger.info('Setting cached discovery.');
            this.discoveryPromise = this.doDiscoverDevicesAsync();
            this.lastDiscoveryTimestamp = getTimeInMilliseconds();
        }

        return await this.discoveryPromise;
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
            this.logger.info(`Discovered: ${deviceOptions.address}`);
            const light = this.lightFactory.createLight(deviceOptions.address);
            this.lightsCache[deviceOptions.address] = light;
        });
    }

    public dispose(): void {
        if (this.discoveryThresholdTimeout !== null) clearTimeout(this.discoveryThresholdTimeout)
    }
}

export { ILightsManager };
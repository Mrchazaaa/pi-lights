import LoggerProvider from '../../Logging/LoggerProvider';
import ILogger from '../../Logging/ILogger'
import Light from './Light'
import { Discovery } from 'magic-home';

export default class LightsManager {

	private logger: ILogger;
    private lightsCache: {[index:string]:Light} = {};

    constructor() {
		this.logger = LoggerProvider.createLogger(LightsManager.constructor.name);
    }

    public async discoverDevices(): Promise<void> {
        this.logger.info('Discovering devices.');

        (await Discovery.scan(10000)).forEach((discoveredDevice: {address: string}) => {
            const light = new Light(discoveredDevice, 10000);
            this.lightsCache[discoveredDevice.address] = light;
        });

        this.logger.info(`discovered: ${Object.keys(this.lightsCache)}`);
    }

    public getLights(): Light[] {
        return Object.values(this.lightsCache);
    }

    public areAllLightsDiscovered(): boolean {
        return Object.keys(this.lightsCache).length === 2;
    }
}
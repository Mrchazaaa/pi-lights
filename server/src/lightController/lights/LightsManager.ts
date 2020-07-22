import LoggerFactory from '../../logging/WinstonLoggerFactory';
import ILogger from '../../logging/ILogger'
import Light from './Light'
const { Discovery } = require('magic-home');

export default class LightsManager {

	private logger: ILogger;
    private lightsCatche = {};

    constructor() {
		this.logger = LoggerFactory.createLogger(LightsManager.constructor.name);
    }

    public async discoverDevices() {
        this.logger.info("Discovering devices.");

        (await Discovery.scan(10000)).forEach(function (discoveredDevice: {address: string}) {
            var light = new Light(discoveredDevice, 10000);
            this.lightsCache[discoveredDevice.address] = light;
        });
    
        this.logger.info(`discovered: ${Object.keys(this.lightsCatche)}`);
    }

    public getLights(): Light[] {
        return Object.values(this.lightsCatche);
    }

    public areAllLightsDiscovered(): Boolean {
        return Object.keys(this.lightsCatche).length == 2;
    }
}
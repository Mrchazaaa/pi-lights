import LoggerFactory from '../../logging/WinstonLoggerFactory';
import ILogger from '../../logging/ILogger'
import { LightState } from './LightState';
const { timeout } = require('promise-timeout');
const { Control } = require('magic-home');

export default class Light {
    
    private logger: ILogger;
    private lightControl: typeof Control;
    private promiseTimeout: Number;
    private cachedOnState: LightState;
    public address: string;

    constructor(light: {address: string}, promiseTimeout: Number) {
		this.logger = LoggerFactory.createLogger(Light.constructor.name);
        this.promiseTimeout = promiseTimeout;
        this.cachedOnState = LightState.Unknown;
        this.address = light.address;

        this.lightControl = new Control(
            light.address, 
            {
                ack: Control.ackMask(1), 
                // connect_timeout: 10000, 
                log_all_received: true
            }
        );
    }

    public haveLightsBeenTurnedOn() {
        return this.cachedOnState;
    }

    public async turnOn() {
        var result = await this.handleConnectionErrors(async (device: typeof Control) => (await device.turnOn()), `Turning on ${this.lightControl._address}.`);

        this.cachedOnState = result ? LightState.On : LightState.Off;

        return result;
    }

    public async turnOff() {
        var result = await this.handleConnectionErrors(async (device: typeof Control) => (await device.turnOff()), `Turning off ${this.lightControl._address}.`);
        
        this.cachedOnState = result ? LightState.Off : LightState.On;
 
        return result;
    }

    public async areLightsOn() {
        var result = await this.handleConnectionErrors(async (device: typeof Control) => (await device.queryState()).on, `Querying on state of ${this.lightControl._address}.`);

        this.cachedOnState = result ? LightState.On : LightState.Off;

        return result;
    }

    private async handleConnectionErrors(operation: (lightControl: typeof Control) => any, description: string) {
        try{
            this.logger.info(description);
            var response = await timeout(await operation(this.lightControl), this.promiseTimeout);
            this.logger.info(`${description} responded with ${response}`); 
            return response;
        }
        catch(e) {
            throw e;
        } 
    }
}
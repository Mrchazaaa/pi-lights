import LoggerProvider from '../../Logging/LoggerProvider';
import ILogger from '../../Logging/ILogger'
import LightState from './LightState';
import { timeout } from 'promise-timeout';
import { Control, IControl, IControlState } from 'magic-home';
import ILight from './ILight';

export default class Light implements ILight {

    private logger: ILogger;
    private lightControl: IControl;
    private promiseTimeout: number;
    private cachedOnState: LightState;
    public address: string;

    constructor(address: string, promiseTimeout: number) {
		this.logger = LoggerProvider.createLogger(Light.name);
        this.promiseTimeout = promiseTimeout;
        this.cachedOnState = LightState.Unknown;
        this.address = address;

        this.lightControl = new Control(
            address,
            {
                ack: Control.ackMask(1),
                log_all_received: true
            }
        );
    }

    public getCachedOnState() {
        return this.cachedOnState;
    }

    public async turnOnAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors(async (device: IControl) => device.turnOn(), `Turning on ${this.lightControl._address}.`);

        this.cachedOnState = result ? LightState.On : LightState.Unknown;

        return result;
    }

    public async turnOffAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors(async (device: typeof Control) => device.turnOff(), `Turning off ${this.lightControl._address}.`);

        this.cachedOnState = result ? LightState.Off : LightState.Unknown;

        return result;
    }

    public async updateStateCacheAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors<IControlState>(async (device: typeof Control) => device.queryState(), `Querying on state of ${this.lightControl._address}.`);

        this.cachedOnState = result.on ? LightState.On : LightState.Off;

        return result.on;
    }

    private async handleConnectionErrors<TReturn>(operation: (lightControl: IControl) => Promise<TReturn>, description: string): Promise<TReturn> {
        try{
            this.logger.info(description);
            const response = await timeout<TReturn>(operation(this.lightControl), this.promiseTimeout);
            this.logger.info(`${description} responded with ${response}`);
            return response;
        }
        catch(e) {
            this.logger.error(e.toString());
            this.cachedOnState = LightState.Unknown;
            throw e;
        }
    }
}
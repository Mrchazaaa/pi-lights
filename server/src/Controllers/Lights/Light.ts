import LoggerProvider, { IDataLogger } from '../../Logging/LoggerProvider';
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
	private dataLogger: IDataLogger;

    constructor(address: string, promiseTimeout: number) {
		this.logger = LoggerProvider.createLogger(Light.name);
        this.promiseTimeout = promiseTimeout;
        this.cachedOnState = LightState.Unknown;
        this.address = address;
		this.dataLogger = LoggerProvider.createDataLogger();

        this.lightControl = new Control(
            address,
            {
                ack: Control.ackMask(1),
                log_all_received: false
            }
        );
    }

    private async setCachedLightState(newState: LightState) {
        switch(newState) {
            case LightState.On:
                await this.dataLogger.logLightState([{name: this.address, state: 1}]);
                break;
            case LightState.Off:
                await this.dataLogger.logLightState([{name: this.address, state: 0}]);
                break;
        }

        this.cachedOnState = newState;
    }

    public getCachedOnState() {
        return this.cachedOnState;
    }

    public async turnOnAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors(async (device: IControl) => device.turnOn(), `Turning on ${this.lightControl._address}.`);

        await this.setCachedLightState(result ? LightState.On : LightState.Unknown);

        return result;
    }

    public async toggleAsync(): Promise<void> {
        this.logger.info(`Toggling light ${this.lightControl._address}.`);

        const state = await this.updateStateCacheAsync();

        if (state) {
            await this.turnOffAsync();
        }
        else {
            await this.turnOnAsync();
        }
    }

    public async turnOffAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors(async (device: typeof Control) => device.turnOff(), `Turning off ${this.lightControl._address}.`);

        await this.setCachedLightState(result ? LightState.Off : LightState.Unknown);

        return result;
    }

    public async setStrobeAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors(async (device: typeof Control) => device.setPattern('seven_color_strobe_flash', 100), `Setting strobe pattern for ${this.lightControl._address}.`);

        await this.setCachedLightState(result ? LightState.On : this.cachedOnState);

        return result;
    }

    public async setAmbientAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors(async (device: typeof Control) => device.setColor(51, 0, 0), `Setting ambient lighting for ${this.lightControl._address}.`);

        await this.setCachedLightState(result ? LightState.On : LightState.Unknown);

        return result;
    }

    public async updateStateCacheAsync(): Promise<boolean> {
        const result = await this.handleConnectionErrors<IControlState>(async (device: typeof Control) => device.queryState(), `Querying on state of ${this.lightControl._address}.`);

        await this.setCachedLightState(result.on ? LightState.On : LightState.Off);

        return result.on;
    }

    private async handleConnectionErrors<TReturn>(operation: (lightControl: IControl) => Promise<TReturn>, description: string): Promise<TReturn> {
        try{
            this.logger.info(description);
            const response = await timeout<TReturn>(operation(this.lightControl), this.promiseTimeout);
            this.logger.info(`${description} responded with ${JSON.stringify(response)}`);
            return response;
        }
        catch(e) {
            this.logger.error(`Operation '${description}' failed.`);
            this.logger.error(e.toString());
            await this.setCachedLightState(LightState.Unknown);
            throw e;
        }
    }
}

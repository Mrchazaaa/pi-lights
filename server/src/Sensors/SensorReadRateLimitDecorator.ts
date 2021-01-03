import LoggerProvider, { ILogger } from '../Logging/LoggerProvider';
import ISensor from './ISensor';
import RateLimitedOperation from '../Utilities/RateLimitedOperation';

export default class SensorReadRateLimitWrapper<TReturn> implements ISensor<TReturn> {
    private logger: ILogger;
    private sensor: ISensor<TReturn>;
    private readingOperation: RateLimitedOperation<Promise<TReturn>>;

    constructor(readRateLimit: number, sensor: ISensor<TReturn>) {
		this.logger = LoggerProvider.createLogger(SensorReadRateLimitWrapper.name);
        this.sensor = sensor;
        this.readingOperation = new RateLimitedOperation(
            (() =>  this.sensor.getReadingAsync()).bind(this),
            readRateLimit);
    }

    public async getReadingAsync(): Promise<TReturn> {
        return this.readingOperation.execute();
    }

    public dispose() {
        this.logger.info('Disposing.');
        this.sensor.dispose();
    }
}

export { ISensor };
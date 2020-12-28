import { getTimeInMilliseconds } from '../TimingHelper';
import LoggerProvider, { ILogger } from '../Logging/LoggerProvider';
import ISensor from './ISensor';

export default class SensorReadRateLimitWrapper<TReturn> implements ISensor<TReturn> {
    private logger: ILogger;
    private sensor: ISensor<TReturn>;
    private readingInvocationTimeout: number;
    private readingPromise: Promise<TReturn> | null;
    private readingThresholdTimeout: NodeJS.Timeout | null;
    private lastReadingTimestamp: number | null;

    constructor(discoveryInvocationTimeout: number, sensor: ISensor<TReturn>) {
		this.logger = LoggerProvider.createLogger(SensorReadRateLimitWrapper.name);
        this.sensor = sensor;
        this.readingInvocationTimeout = discoveryInvocationTimeout;
        this.readingPromise = null;
        this.readingThresholdTimeout = null;
        this.lastReadingTimestamp = null;
    }

    public async getReadingAsync(): Promise<TReturn> {
        this.logger.info('Getting new reading.');

        if (!this.lastReadingTimestamp) {
            this.lastReadingTimestamp = getTimeInMilliseconds();
        }

        const timeSinceLastInvocation = getTimeInMilliseconds() - this.lastReadingTimestamp;
        if (timeSinceLastInvocation > this.readingInvocationTimeout) {
            this.logger.info(`Clearing cached reading after ${timeSinceLastInvocation} ms.`);
            this.readingPromise = null;
        }

        if (this.readingPromise === null) {
            this.logger.info(`Setting cached reading.`);
            this.readingPromise = this.sensor.getReadingAsync();
            this.lastReadingTimestamp = getTimeInMilliseconds();
        }

        return this.readingPromise as Promise<TReturn>;
    }

    public dispose() {
        this.logger.info('Disposing.');

        this.sensor.dispose();
        if (this.readingThresholdTimeout) clearTimeout(this.readingThresholdTimeout);
    }
}

export { ISensor };
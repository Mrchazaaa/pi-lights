import LoggerProvider, { ILogger } from '../Logging/LoggerProvider';
import ISensor from './ISensor';

export default class MeanSensorDecorator implements ISensor<number> {
    private logger: ILogger;
    private internalSensor: ISensor<number>;
    private averageQueueSize: number;
    private averageQueue: number[];

    constructor(averageQueueSize: number, internalSensor: ISensor<number>) {
        this.logger = LoggerProvider.createLogger(MeanSensorDecorator.name);
        this.averageQueueSize = averageQueueSize;
        this.internalSensor = internalSensor;
        this.averageQueue = [];
    }

    public async getReadingAsync(): Promise<number> {
        this.logger.info('Getting averaged reading.');

        if (this.averageQueue.length !== this.averageQueueSize) {
            this.averageQueue = Array(this.averageQueueSize);
            for (let i = 1; i < this.averageQueue.length; i++) {
                this.averageQueue[i] = await this.internalSensor.getReadingAsync();
            }
        }

        const newLightLevel = this.mean(await this.appendNewReadingAsync(this.averageQueue));

        return newLightLevel;
    }

    private mean = (array: number[]) => (array.reduce((a, b) => a + b)) / array.length;

    private async appendNewReadingAsync(pastReadings: number[]): Promise<number[]> {
        const readingsMean = await this.internalSensor.getReadingAsync();

        pastReadings.shift();
        pastReadings.push(readingsMean);

        return pastReadings;
    }

    public dispose(): void {
        this.logger.info('Disposing.');
        this.internalSensor.dispose();
    }
}

export { ISensor };

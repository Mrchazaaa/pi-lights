import LoggerProvider, { ILogger } from '../Logging/LoggerProvider';
import ISensor from './ISensor';

export default class MeanSensorFilter implements ISensor {
    private logger: ILogger;
    private sensors: ISensor[];
    private averageQueueSize: number;
    private averageQueue: number[];

    constructor(averageQueueSize: number, sensors: ISensor[]) {
        this.logger = LoggerProvider.createLogger(MeanSensorFilter.constructor.name);
        this.averageQueueSize = averageQueueSize;
        this.sensors = sensors;
        this.averageQueue = [];
    }

    public async getReadingAsync(): Promise<number> {
        if (this.averageQueue.length !== this.averageQueueSize) {
            this.averageQueue = Array(this.averageQueueSize);
            for (let i = 0; i < this.averageQueue.length; i++) {
                this.averageQueue[i] = await this.getAveragedReadingAsync();
            }
        }

        const newLightLevel = this.mean(await this.appendNewReadingAsync(this.averageQueue));

        this.logger.info('got new light level: ' + newLightLevel);

        return newLightLevel;
    }

    public dispose(): void {
        this.sensors.forEach(x => x.dispose());
    }

    private mean = (array: number[]) => (array.reduce((a, b) => a + b)) / array.length;

    private getAveragedReadingAsync(): Promise<number> {
        return Promise.all(this.sensors.map(sensor => sensor.getReadingAsync()))
            .then(values => {
                return this.mean(values);
            });
    }

    private appendNewReadingAsync(pastReadings: number[]): Promise<number[]> {
        return new Promise(async (resolve) => {
            const readingsMean = await this.getAveragedReadingAsync();

            pastReadings.shift();
            pastReadings.push(readingsMean);

            resolve(pastReadings);
        });
    }
}

export { ISensor };

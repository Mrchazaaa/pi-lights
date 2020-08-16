import jsonfile from 'jsonfile';
import fs from 'fs';
import LightSensor from './LightSensor';
import LoggerProvider from '../../Logging/LoggerProvider';
import ILogger from '../../Logging/ILogger';
import config from '../../../../config.json';
import IAveragingLightSensorsManager from './IAveragingLightSensorsManager';

export default class AveragingLightSensorsManager implements IAveragingLightSensorsManager {
    private logger: ILogger;
    private sensors: LightSensor[];
    private lightLevelThreshold = 195;
    private averageQueueSize: number;
    private averageQueue: number[] = [];

    constructor() {
        this.logger = LoggerProvider.createLogger(AveragingLightSensorsManager.constructor.name);
        this.averageQueueSize = 100;

        this.sensors = [
            new LightSensor(4),
            new LightSensor(4),
        ];
    }

    public async isDarkAsync(): Promise<boolean> {
        // lower value means the detected light is bright
        return (this.lightLevelThreshold - await this.getLightLevel()) <= 0;
    }
    private mean(array: number[]): number {
        return (array.reduce((a, b) => a + b)) / array.length;
    }

    private getAverageSensorReadingsAsync(): Promise<number> {
        return Promise.all(this.sensors.map(sensor => sensor.getLightReading()))
            .then(values => {
                return this.mean(values);
            });
    }

    private appendNewReadingAsync(pastReadings: number[]): Promise<number[]> {
        return new Promise(async (resolve, reject) => {
            const readingsMean = await this.getAverageSensorReadingsAsync();

            pastReadings.shift();
            pastReadings.push(readingsMean);

            resolve(pastReadings);
        });
    }

    private async getLightLevel(): Promise<number> {
        if (this.averageQueue.length !== this.averageQueueSize) {
            this.averageQueue = new Array(this.averageQueueSize).fill(await this.getAverageSensorReadingsAsync());
        }

        await this.appendNewReadingAsync(this.averageQueue);

        const newLightLevel = this.mean(this.averageQueue);

        // log new level
        this.logger.info('got new light level: ' + newLightLevel);

        this.logDatum(newLightLevel);

        return newLightLevel;
    }


    private logDatum(datum: number): void {
        try {
            const filepath = `${config.dataBaseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

            let data: any = {};

            if (fs.existsSync(filepath)) {
                data =jsonfile.readFileSync(filepath);
            }

            data[Date.now()] = datum;

            jsonfile.writeFileSync(filepath, data);
        } catch (e) {
            this.logger.error(e);
        }
    }
}
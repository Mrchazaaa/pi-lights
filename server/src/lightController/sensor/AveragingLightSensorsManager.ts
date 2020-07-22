import jsonfile from 'jsonfile';
import fs from 'fs';
import LightSensor from './LightSensor';
import LoggerFactory from '../../logging/WinstonLoggerFactory';
import ILogger from '../../logging/ILogger';
import config from '../../../../config.json';

export default class AveragingLightSensorsManager {
    private logger: ILogger;
    private sensors: LightSensor[];
    private lightLevelThreshold = 195;
    private averageQueueSize: number;
    private averageQueue: Array<number> = [];

    constructor() {
        this.logger = LoggerFactory.createLogger(AveragingLightSensorsManager.constructor.name);
        this.averageQueueSize = 100;
        
        this.sensors = [
            new LightSensor(4),
            new LightSensor(4),
        ];
    }

    public async isDark(): Promise<Boolean> {
        // lower value means the detected light is bright 
        return (this.lightLevelThreshold - await this.getLightLevel()) <= 0;
    }
    private mean(array: Array<number>): number {
        return (array.reduce((a, b) => a + b)) / array.length;
    }

    private getAverageSensorReadings(): Promise<number> {
        return Promise.all(this.sensors.map(sensor => sensor.getLightReading()))
            .then(values => {
                return this.mean(values);
            });
    }

    private appendNewReading(pastReadings: Array<number>): Promise<Array<number>> {
        return new Promise(async (resolve, reject) => {
            var readingsMean = await this.getAverageSensorReadings();
        
            pastReadings.shift();
            pastReadings.push(readingsMean);

            resolve(pastReadings);
        });
    }
    
    private async getLightLevel(): Promise<number> {
        if (this.averageQueue.length != this.averageQueueSize) {
            this.averageQueue = new Array(this.averageQueueSize).fill(await this.getAverageSensorReadings());
        }

        await this.appendNewReading(this.averageQueue);

        var newLightLevel = this.mean(this.averageQueue);
        
        // log new level
        this.logger.info("got new light level: " + newLightLevel);

        this.logDatum(newLightLevel);

        return newLightLevel;
    }

    
    private logDatum(datum: Number): void {
        try {
            const filepath = `${config["dataBaseFilePath"]}/${new Date().toISOString().replace(/T.*/, '')}.json`;
        
            var data: any = {};

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
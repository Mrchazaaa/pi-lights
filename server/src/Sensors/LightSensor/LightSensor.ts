import ISensor from '../ISensor';
import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import TSL2561 from './TSL2561';

export default class LightSensor implements ISensor<number> {
    private logger: ILogger;
    private innerSensor: TSL2561;

    constructor(innerSensor: TSL2561) {
        this.logger = LoggerProvider.createLogger(LightSensor.name);
        this.innerSensor = innerSensor;
    }

    public async getReadingAsync(): Promise<number> {
        return (await this.innerSensor.getReadingAsync()).ambient;
    }

    public dispose() {
        this.logger.info('Disposing.');
        this.innerSensor.dispose();
    }
}

export { ISensor };
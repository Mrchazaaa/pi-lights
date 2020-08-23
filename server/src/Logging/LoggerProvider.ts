import { dataBaseFilePath, logsBaseFilePath } from '../../../config.json';
import ILogger from './ILogger';
import WinstonLoggerFactory from './WinstonLoggerFactory';
import DataLogger, { IDataLogger } from './DataLogger';

export default class LoggerProvider {
    private static isDisabled: boolean = false;
    private static logger: ILogger;

    public static disableLogging(): void {
        this.isDisabled = true;
        WinstonLoggerFactory.disableLogging();
    }

    public static createLogger(context: string): ILogger  {
        return WinstonLoggerFactory.createLogger(context, logsBaseFilePath);
    }

    public static createDataLogger(): IDataLogger  {
        if (this.isDisabled) {
            return {
               log: () => { return; }
            };
        } else {
            return new DataLogger(dataBaseFilePath);
        }
    }
}

export { ILogger, IDataLogger };
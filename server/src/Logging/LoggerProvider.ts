import * as Config from '../../../config.json';
import ILogger from './ILogger';
import WinstonLoggerFactory from './WinstonLoggerFactory';
import DataLogger, { IDataLogger } from './DataLogger';

export default class LoggerProvider {
    private static isDisabled: boolean = false;

    public static disableLogging(): void {
        this.isDisabled = true;
        WinstonLoggerFactory.disableLogging();
    }

    public static createLogger(context: string): ILogger  {
        const logsBaseFilePath = Config.logsBaseFilePath;

        return WinstonLoggerFactory.createLogger(context, logsBaseFilePath);
    }

    public static createDataLogger(): IDataLogger  {
        const logsBaseFilePath = Config.logsBaseFilePath;

        if (this.isDisabled) {
            return {
               log: () => { return; }
            };
        } else {
            return new DataLogger(logsBaseFilePath);
        }
    }
}

export { ILogger, IDataLogger };
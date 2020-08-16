import Config from '../../../config.json';
import ILogger from "./ILogger";
import WinstonLoggerFactory from "./WinstonLoggerFactory";

export default class LoggerProvider {
    private static isDisabled: boolean = false;
    
    public static disableLogging(): void {
        WinstonLoggerFactory.disableLogging();
    }

    public static createLogger(context: string): ILogger  {
        const logsBaseFilePath = Config.logsBaseFilePath;

        return WinstonLoggerFactory.createLogger(context, logsBaseFilePath);
    }
}

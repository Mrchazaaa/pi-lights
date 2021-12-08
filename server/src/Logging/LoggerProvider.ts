/* istanbul ignore file */

import { dataBaseFilePath, logsBaseFilePath, maxFiles } from '../../../config.json';
import { Logger } from 'winston';
import WinstonLoggerFactory from './WinstonLoggerFactory';
import DataLogger, { IDataLogger } from './DataLogger';
import ContextAwareLogger, { ILogger } from './ContextAwareLogger';

export default class LoggerProvider {
    private static isDisabled: boolean = false;
    private static logger: Logger;
    private static disabledLogger: Logger;
    private static dataLogger: DataLogger;

    public static disableLogging(): void {
        this.isDisabled = true;
    }

    public static createLogger(context: string): ILogger  {
        if (this.isDisabled) {
            if (!this.disabledLogger) this.disabledLogger = WinstonLoggerFactory.createDisabledLogger()

            return this.disabledLogger;
        }

        if (!this.logger) this.logger = WinstonLoggerFactory.createLogger(logsBaseFilePath, this.isDisabled, maxFiles)

        return new ContextAwareLogger(this.logger, context);
    }

    public static createDataLogger(): IDataLogger  {
        if (this.isDisabled) {
            return { logLux: async () => { return new Promise(res => undefined) }, logThreshold: async () => { return new Promise(res => undefined) }, logLightState: async () => { return new Promise(res => undefined) } }
        }

        if (!this.dataLogger) this.dataLogger = new DataLogger(dataBaseFilePath, maxFiles);

        return this.dataLogger;
    }
}

export { ILogger, IDataLogger };
import ILogger from './ILogger';
import 'winston-daily-rotate-file';
import Winston from 'winston';
const { format } = Winston;
const { combine, label, json } = format;

export default class WinstonLoggerFactory {
    private static isDisabled: boolean = false;

    public static disableLogging(): void {
       this.isDisabled = true;
    }

    public static createLogger(context: string, logsBaseFilePath: string): ILogger  {

        const transports = [this.isDisabled ? this.createDummyTransport() : this.createDailyRotateTransport(logsBaseFilePath)];

        return Winston.createLogger({
            level: 'info',
            transports,
            format: combine(
                label({ label: context }),
                json()
            )
        });
    }

    private static createDummyTransport(): Winston.transport {
        return new Winston.transports.Console({
            silent: true
        });
    }

    private static createDailyRotateTransport(logsBaseFilePath: string): Winston.transport {
        return new Winston.transports.DailyRotateFile({
            filename: `${logsBaseFilePath}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
        });
    }
}
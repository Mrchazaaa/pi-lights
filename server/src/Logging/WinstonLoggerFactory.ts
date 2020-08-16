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

        const rotateTransport = new Winston.transports.DailyRotateFile({
            filename: `${logsBaseFilePath}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
        });

        rotateTransport.silent = WinstonLoggerFactory.isDisabled;

        return Winston.createLogger({
            level: 'info',
            transports: [
                rotateTransport
            ],
            format: combine(
                label({ label: context }),
                json()
            )
        });
    }
}

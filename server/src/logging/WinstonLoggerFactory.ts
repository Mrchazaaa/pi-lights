import Config from '../../../config.json';
import ILogger from './ILogger';
import 'winston-daily-rotate-file';
import Winston from 'winston';
const { format } = Winston;
const { combine, label, json } = format;

export default class WinstonLoggerFactory  {
    public static createLogger(context: string): ILogger  {
        const logsBaseFilePath = Config["logsBaseFilePath"];

        const rotateTransport = new Winston.transports.DailyRotateFile({
            filename: `${logsBaseFilePath}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
        });
    
        return Winston.createLogger({
            level: 'info',
            transports: [
                rotateTransport,
            ],
            format: combine(
                label({ label: context }),
                json()
            )
        });
    }
}

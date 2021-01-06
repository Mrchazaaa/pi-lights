import 'winston-daily-rotate-file';
import Winston, { format, Logger } from 'winston';
const { combine, timestamp } = format;

export default class WinstonLoggerFactory {
    public static createLogger(logsBaseFilePath: string, isDisabled: boolean): Logger  {
        return Winston.createLogger({
            transports: [ this.createLogsDailyRotateTransport(logsBaseFilePath) ],
            format: combine(
                timestamp({ format: 'HH:mm:ss' }),
                format.printf(info => {
                    const infoLevel = info.level + ':' + ' '.repeat('error'.length - info.level.length);
                    return `${info.timestamp} ${infoLevel} ${info.message}`
                }),
            ),
        });
    }

    public static createDisabledLogger(): Logger  {
        return Winston.createLogger({
            transports: [ this.createDummyTransport() ],
            format: combine(
                timestamp({ format: 'HH:mm:ss.SS' }),
                format.printf(info => {
                    const infoLevel = info.level + ':' + ' '.repeat('error'.length - info.level.length);
                    return `${info.timestamp} ${infoLevel} ${info.message}`
                }),
            ),
        });
    }

    private static createDummyTransport(): Winston.transport {
        return new Winston.transports.Console({
            silent: true
        });
    }

    private static createLogsDailyRotateTransport(logsBaseFilePath: string): Winston.transport {
        return new Winston.transports.DailyRotateFile({
            filename: `${logsBaseFilePath}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
        });
    }
}
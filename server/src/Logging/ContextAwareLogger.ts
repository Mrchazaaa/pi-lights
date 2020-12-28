import { Logger } from 'winston';
import ILogger from './ILogger';

export default class ContextAwareLogger implements ILogger {
    private internalLogger: Logger;
    private context: string;

    constructor(internalLogger: Logger, context: string) {
        this.internalLogger = internalLogger;
        this.context = context;
    }

    public error(message: any) {
        this.internalLogger.error(`[${this.context}] ${message}`, { seriously: true });
    }

    public info(message: string) {
        this.internalLogger.info(`[${this.context}] ${message}`, { seriously: true });
    }
}

export { ILogger };
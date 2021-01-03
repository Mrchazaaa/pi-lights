import LoggerProvider, { ILogger } from '../Logging/LoggerProvider';
import { getTimeInMilliseconds } from './TimingHelper';

export default class RateLimitedOperation<TReturn> {
    private logger: ILogger;
    private operation: () => TReturn;
    private lastResult?: TReturn
    private lastExecutionTimestamp?: number;
    private rateLimit: number;

    constructor(operation: () => TReturn, invocationRateLimit: number) {
		this.logger = LoggerProvider.createLogger(RateLimitedOperation.name);
        this.operation = operation;
        this.rateLimit = invocationRateLimit;
    }

    public execute(): TReturn {
        if (!this.lastExecutionTimestamp) {
            this.lastExecutionTimestamp = getTimeInMilliseconds();
        }

        const timeSinceLastInvocation = getTimeInMilliseconds() - this.lastExecutionTimestamp;
        if (timeSinceLastInvocation > this.rateLimit) {
            this.logger.info(`Clearing cached result after ${timeSinceLastInvocation} ms.`);
            this.lastResult = undefined;
        }

        if (this.lastResult === undefined) {
            this.logger.info(`Setting cached result.`);
            this.lastResult = this.operation();
            this.lastExecutionTimestamp = getTimeInMilliseconds();
        }

        return this.lastResult;
    }
}
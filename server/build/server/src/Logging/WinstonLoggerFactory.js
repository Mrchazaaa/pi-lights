"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("winston-daily-rotate-file");
const winston_1 = tslib_1.__importDefault(require("winston"));
const { format } = winston_1.default;
const { combine, label, json } = format;
class WinstonLoggerFactory {
    static disableLogging() {
        this.isDisabled = true;
    }
    static createLogger(context, logsBaseFilePath) {
        const transports = [this.isDisabled ? this.createDummyTransport() : this.createDailyRotateTransport(logsBaseFilePath)];
        return winston_1.default.createLogger({
            level: 'info',
            transports,
            format: combine(label({ label: context }), json())
        });
    }
    static createDummyTransport() {
        return new winston_1.default.transports.Console({
            silent: true
        });
    }
    static createDailyRotateTransport(logsBaseFilePath) {
        return new winston_1.default.transports.DailyRotateFile({
            filename: `${logsBaseFilePath}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
        });
    }
}
exports.default = WinstonLoggerFactory;
WinstonLoggerFactory.isDisabled = false;
//# sourceMappingURL=WinstonLoggerFactory.js.map
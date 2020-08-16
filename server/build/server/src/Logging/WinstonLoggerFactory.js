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
        const rotateTransport = new winston_1.default.transports.DailyRotateFile({
            filename: `${logsBaseFilePath}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
        });
        rotateTransport.silent = WinstonLoggerFactory.isDisabled;
        return winston_1.default.createLogger({
            level: 'info',
            transports: [
                rotateTransport
            ],
            format: combine(label({ label: context }), json())
        });
    }
}
exports.default = WinstonLoggerFactory;
WinstonLoggerFactory.isDisabled = false;
//# sourceMappingURL=WinstonLoggerFactory.js.map
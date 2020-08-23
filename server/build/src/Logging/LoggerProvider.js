"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_js_1 = tslib_1.__importDefault(require("../../../config.js"));
const WinstonLoggerFactory_1 = tslib_1.__importDefault(require("./WinstonLoggerFactory"));
const DataLogger_1 = tslib_1.__importDefault(require("./DataLogger"));
class LoggerProvider {
    static disableLogging() {
        this.isDisabled = true;
        WinstonLoggerFactory_1.default.disableLogging();
    }
    static createLogger(context) {
        const logsBaseFilePath = config_js_1.default.logsBaseFilePath;
        return WinstonLoggerFactory_1.default.createLogger(context, logsBaseFilePath);
    }
    static createDataLogger() {
        const logsBaseFilePath = config_js_1.default.logsBaseFilePath;
        if (this.isDisabled) {
            return {
                log: () => { return; }
            };
        }
        else {
            return new DataLogger_1.default(logsBaseFilePath);
        }
    }
}
exports.default = LoggerProvider;
LoggerProvider.isDisabled = false;
//# sourceMappingURL=LoggerProvider.js.map
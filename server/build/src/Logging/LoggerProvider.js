"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_js_1 = tslib_1.__importDefault(require("../../../config.js"));
const WinstonLoggerFactory_1 = tslib_1.__importDefault(require("./WinstonLoggerFactory"));
class LoggerProvider {
    static disableLogging() {
        WinstonLoggerFactory_1.default.disableLogging();
    }
    static createLogger(context) {
        const logsBaseFilePath = config_js_1.default.logsBaseFilePath;
        return WinstonLoggerFactory_1.default.createLogger(context, logsBaseFilePath);
    }
}
exports.default = LoggerProvider;
LoggerProvider.isDisabled = false;
//# sourceMappingURL=LoggerProvider.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LoggerProvider_1 = tslib_1.__importDefault(require("../../Logging/LoggerProvider"));
const LightState_1 = tslib_1.__importDefault(require("./LightState"));
const promise_timeout_1 = require("promise-timeout");
const magic_home_1 = require("magic-home");
class Light {
    constructor(address, promiseTimeout) {
        this.logger = LoggerProvider_1.default.createLogger(Light.constructor.name);
        this.promiseTimeout = promiseTimeout;
        this.cachedOnState = LightState_1.default.Unknown;
        this.address = address;
        this.lightControl = new magic_home_1.Control(address, {
            ack: magic_home_1.Control.ackMask(1),
            log_all_received: true
        });
    }
    getCachedOnState() {
        return this.cachedOnState;
    }
    turnOnAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.handleConnectionErrors((device) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield device.turnOn(); }), `Turning on ${this.lightControl._address}.`);
            this.cachedOnState = result ? LightState_1.default.On : LightState_1.default.Unknown;
            return result;
        });
    }
    turnOffAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.handleConnectionErrors((device) => tslib_1.__awaiter(this, void 0, void 0, function* () { return (yield device.turnOff()); }), `Turning off ${this.lightControl._address}.`);
            this.cachedOnState = result ? LightState_1.default.Off : LightState_1.default.Unknown;
            return result;
        });
    }
    areLightsOnAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.handleConnectionErrors((device) => tslib_1.__awaiter(this, void 0, void 0, function* () { return (yield device.queryState()); }), `Querying on state of ${this.lightControl._address}.`);
            this.cachedOnState = result.on ? LightState_1.default.On : LightState_1.default.Off;
            return result.on;
        });
    }
    handleConnectionErrors(operation, description) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.info(description);
                const response = yield promise_timeout_1.timeout(operation(this.lightControl), this.promiseTimeout);
                this.logger.info(`${description} responded with ${response}`);
                return response;
            }
            catch (e) {
                this.logger.error(e);
                this.cachedOnState = LightState_1.default.Unknown;
                throw e;
            }
        });
    }
}
exports.default = Light;
//# sourceMappingURL=Light.js.map
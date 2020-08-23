"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LoggerProvider_1 = tslib_1.__importDefault(require("./Logging/LoggerProvider"));
const LightState_1 = tslib_1.__importDefault(require("./Controllers/Lights/LightState"));
class LightSensingLightSwitcher {
    constructor(lightsManager, meanSensorFilter, lightThreshold) {
        this.logger = LoggerProvider_1.default.createLogger(LightSensingLightSwitcher.constructor.name);
        this.dataLogger = LoggerProvider_1.default.createDataLogger();
        this.lightsManager = lightsManager;
        this.meanSensorFilter = meanSensorFilter;
        this.lightThreshold = lightThreshold;
        this.shouldControlLoopRun = false;
    }
    cancelControlLoop() {
        this.logger.info('Stopping control loop.');
        this.shouldControlLoopRun = false;
    }
    runControlLoopAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info('Running control loop.');
            this.shouldControlLoopRun = true;
            while (this.shouldControlLoopRun) {
                if (!this.lightsManager.areAllLightsDiscovered()) {
                    yield this.lightsManager.discoverDevices();
                }
                this.lightsManager.getLights().forEach((light) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.controlLightAsync(light); }));
            }
        });
    }
    controlLightAsync(light) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (light.getCachedOnState() === LightState_1.default.Unknown) {
                    yield light.areLightsOnAsync();
                    this.logger.info(`Initializing light state cache for ${light.address}, haveLightsBeenTurnedOn: ${light.getCachedOnState()}.`);
                }
                if (yield this.isDarkAsync()) {
                    this.logger.info('it is dark');
                    if (light.getCachedOnState() === LightState_1.default.Off) {
                        yield light.turnOnAsync();
                    }
                }
                else {
                    this.logger.info('it is not dark');
                    if (light.getCachedOnState() === LightState_1.default.On) {
                        yield light.turnOffAsync();
                    }
                }
            }
            catch (e) {
                this.logger.info(`could not connect to ${light.address}.`);
                this.logger.error(e);
            }
        });
    }
    isDarkAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reading = yield this.meanSensorFilter.getReadingAsync();
            this.dataLogger.log(reading);
            return (this.lightThreshold - reading) <= 0;
        });
    }
}
exports.default = LightSensingLightSwitcher;
//# sourceMappingURL=LightSensingLightSwitcher.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LoggerProvider_1 = tslib_1.__importDefault(require("./Logging/LoggerProvider"));
const LightState_1 = tslib_1.__importDefault(require("./Controllers/Lights/LightState"));
class LightSensingLightSwitcher {
    constructor(lightsManager, averageLightSensorsManager) {
        this.logger = LoggerProvider_1.default.createLogger(LightSensingLightSwitcher.constructor.name);
        this.lightsManager = lightsManager;
        this.lightSensorsManager = averageLightSensorsManager;
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
                if (light.cachedOnstate() === LightState_1.default.Unknown) {
                    yield light.areLightsOnAsync();
                    this.logger.info(`Initializing light state cache for ${light.address}, haveLightsBeenTurnedOn: ${light.cachedOnstate()}.`);
                }
                switch (yield this.lightSensorsManager.isDarkAsync()) {
                    case true:
                        this.logger.info('it is dark');
                        if (light.cachedOnstate() === LightState_1.default.Off) {
                            yield light.turnOnAsync();
                        }
                        break;
                    case false:
                        this.logger.info('it is not dark');
                        if (light.cachedOnstate() === LightState_1.default.On) {
                            yield light.turnOffAsync();
                        }
                        break;
                }
            }
            catch (e) {
                this.logger.info(`could not connect to ${light.address}.`);
                this.logger.error(e);
            }
        });
    }
}
exports.default = LightSensingLightSwitcher;
//# sourceMappingURL=LightSensingLightSwitcher.js.map
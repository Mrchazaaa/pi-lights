"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const WinstonLoggerFactory_1 = tslib_1.__importDefault(require("../logging/WinstonLoggerFactory"));
const LightsManager_1 = tslib_1.__importDefault(require("./lights/LightsManager"));
const LightState_1 = require("./lights/LightState");
const AveragingLightSensorsManager_1 = tslib_1.__importDefault(require("./sensor/AveragingLightSensorsManager"));
class LightSensingLightController {
    constructor() {
        this.logger = WinstonLoggerFactory_1.default.createLogger(LightSensingLightController.constructor.name);
        this.lightsManager = new LightsManager_1.default();
        this.lightSensorsManager = new AveragingLightSensorsManager_1.default();
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            while (true) {
                if (!this.lightsManager.areAllLightsDiscovered()) {
                    yield this.lightsManager.discoverDevices();
                }
                this.lightsManager.getLights().forEach((device) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.runControlLoop(device); }));
            }
        });
    }
    runControlLoop(light) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (light.haveLightsBeenTurnedOn() === LightState_1.LightState.Unknown) {
                    yield light.areLightsOn();
                }
                switch (yield this.lightSensorsManager.isDark()) {
                    case true:
                        this.logger.info('it is dark');
                        if (light.haveLightsBeenTurnedOn() === LightState_1.LightState.Off) {
                            yield light.turnOn();
                        }
                        break;
                    case false:
                        this.logger.info('it is not dark');
                        if (light.haveLightsBeenTurnedOn() === LightState_1.LightState.On) {
                            yield light.turnOff();
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
exports.default = LightSensingLightController;
//# sourceMappingURL=LightSensingLightController.js.map
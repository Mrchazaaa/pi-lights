"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LoggerProvider_1 = tslib_1.__importDefault(require("../../Logging/LoggerProvider"));
const magic_home_1 = require("magic-home");
class LightsManager {
    constructor(discoveryTimeout, numberOfLights, lightFactory) {
        this.lightsCache = {};
        this.logger = LoggerProvider_1.default.createLogger(LightsManager.constructor.name);
        this.discoveryTimeout = discoveryTimeout;
        this.maxLights = numberOfLights;
        this.lightFactory = lightFactory;
    }
    discoverDevices() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info('Discovering devices.');
            (yield magic_home_1.Discovery.scan(this.discoveryTimeout)).forEach((deviceOptions) => {
                const light = this.lightFactory.createLight(deviceOptions.address);
                this.lightsCache[deviceOptions.address] = light;
            });
            this.logger.info(`discovered: ${Object.keys(this.lightsCache)}`);
        });
    }
    getLights() {
        return Object.values(this.lightsCache);
    }
    areAllLightsDiscovered() {
        return Object.keys(this.lightsCache).length === this.maxLights;
    }
}
exports.default = LightsManager;
//# sourceMappingURL=LightsManager.js.map
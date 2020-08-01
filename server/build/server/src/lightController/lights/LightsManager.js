"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const WinstonLoggerFactory_1 = tslib_1.__importDefault(require("../../logging/WinstonLoggerFactory"));
const Light_1 = tslib_1.__importDefault(require("./Light"));
const magic_home_1 = require("magic-home");
class LightsManager {
    constructor() {
        this.lightsCache = {};
        this.logger = WinstonLoggerFactory_1.default.createLogger(LightsManager.constructor.name);
    }
    discoverDevices() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info('Discovering devices.');
            (yield magic_home_1.Discovery.scan(10000)).forEach((discoveredDevice) => {
                const light = new Light_1.default(discoveredDevice, 10000);
                this.lightsCache[discoveredDevice.address] = light;
            });
            this.logger.info(`discovered: ${Object.keys(this.lightsCache)}`);
        });
    }
    getLights() {
        return Object.values(this.lightsCache);
    }
    areAllLightsDiscovered() {
        return Object.keys(this.lightsCache).length === 2;
    }
}
exports.default = LightsManager;
//# sourceMappingURL=LightsManager.js.map
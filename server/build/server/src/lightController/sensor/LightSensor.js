"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const onoff_1 = require("onoff");
const WinstonLoggerFactory_1 = tslib_1.__importDefault(require("../../logging/WinstonLoggerFactory"));
class LightSensor {
    constructor(sensorGPIO) {
        this.logger = WinstonLoggerFactory_1.default.createLogger(LightSensor.constructor.name);
        this.GPIO = new onoff_1.Gpio(sensorGPIO, 'out');
    }
    getLightReading() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let count = 0;
            this.GPIO.setDirection('out');
            yield this.GPIO.write(0);
            setTimeout((gpio) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                gpio.setDirection('in');
                while ((yield gpio.read()) === 0) {
                    count += 1;
                }
                resolve(count);
            }), 100, this.GPIO);
        }));
    }
    dispose() {
        this.GPIO.unexport();
    }
}
exports.default = LightSensor;
//# sourceMappingURL=LightSensor.js.map
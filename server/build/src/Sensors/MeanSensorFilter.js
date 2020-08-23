"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LoggerProvider_1 = tslib_1.__importDefault(require("../Logging/LoggerProvider"));
class MeanSensorFilter {
    constructor(averageQueueSize, sensors) {
        this.mean = (array) => (array.reduce((a, b) => a + b)) / array.length;
        this.logger = LoggerProvider_1.default.createLogger(MeanSensorFilter.constructor.name);
        this.averageQueueSize = averageQueueSize;
        this.sensors = sensors;
        this.averageQueue = [];
    }
    getReadingAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.averageQueue.length !== this.averageQueueSize) {
                this.averageQueue = Array(this.averageQueueSize);
                for (let i = 0; i < this.averageQueue.length; i++) {
                    this.averageQueue[i] = yield this.getAveragedReadingAsync();
                }
            }
            const newLightLevel = this.mean(yield this.appendNewReadingAsync(this.averageQueue));
            this.logger.info('got new light level: ' + newLightLevel);
            return newLightLevel;
        });
    }
    dispose() {
        this.sensors.forEach(x => x.dispose());
    }
    getAveragedReadingAsync() {
        return Promise.all(this.sensors.map(sensor => sensor.getReadingAsync()))
            .then(values => {
            return this.mean(values);
        });
    }
    appendNewReadingAsync(pastReadings) {
        return new Promise((resolve) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const readingsMean = yield this.getAveragedReadingAsync();
            pastReadings.shift();
            pastReadings.push(readingsMean);
            resolve(pastReadings);
        }));
    }
}
exports.default = MeanSensorFilter;
//# sourceMappingURL=MeanSensorFilter.js.map
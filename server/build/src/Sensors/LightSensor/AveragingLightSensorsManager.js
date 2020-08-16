"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonfile_1 = tslib_1.__importDefault(require("jsonfile"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const LightSensor_1 = tslib_1.__importDefault(require("./LightSensor"));
const LoggerProvider_1 = tslib_1.__importDefault(require("../../Logging/LoggerProvider"));
const config_js_1 = tslib_1.__importDefault(require("../../../../config.js"));
class AveragingLightSensorsManager {
    constructor() {
        this.lightLevelThreshold = 195;
        this.averageQueue = [];
        this.logger = LoggerProvider_1.default.createLogger(AveragingLightSensorsManager.constructor.name);
        this.averageQueueSize = 100;
        this.sensors = [
            new LightSensor_1.default(4),
            new LightSensor_1.default(4),
        ];
    }
    isDarkAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (this.lightLevelThreshold - (yield this.getLightLevel())) <= 0;
        });
    }
    mean(array) {
        return (array.reduce((a, b) => a + b)) / array.length;
    }
    getAverageSensorReadingsAsync() {
        return Promise.all(this.sensors.map(sensor => sensor.getLightReading()))
            .then(values => {
            return this.mean(values);
        });
    }
    appendNewReadingAsync(pastReadings) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const readingsMean = yield this.getAverageSensorReadingsAsync();
            pastReadings.shift();
            pastReadings.push(readingsMean);
            resolve(pastReadings);
        }));
    }
    getLightLevel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.averageQueue.length !== this.averageQueueSize) {
                this.averageQueue = new Array(this.averageQueueSize).fill(yield this.getAverageSensorReadingsAsync());
            }
            yield this.appendNewReadingAsync(this.averageQueue);
            const newLightLevel = this.mean(this.averageQueue);
            this.logger.info('got new light level: ' + newLightLevel);
            this.logDatum(newLightLevel);
            return newLightLevel;
        });
    }
    logDatum(datum) {
        try {
            const filepath = `${config_js_1.default.dataBaseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;
            let data = {};
            if (fs_1.default.existsSync(filepath)) {
                data = jsonfile_1.default.readFileSync(filepath);
            }
            data[Date.now()] = datum;
            jsonfile_1.default.writeFileSync(filepath, data);
        }
        catch (e) {
            this.logger.error(e);
        }
    }
}
exports.default = AveragingLightSensorsManager;
//# sourceMappingURL=AveragingLightSensorsManager.js.map
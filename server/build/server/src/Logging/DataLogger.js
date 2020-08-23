"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const jsonfile_1 = tslib_1.__importDefault(require("jsonfile"));
class DataLogger {
    constructor(baseFilePath) {
        this.baseFilePath = baseFilePath;
    }
    log(datum) {
        const filepath = `${this.baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;
        let data = {};
        if (fs_1.default.existsSync(filepath)) {
            data = jsonfile_1.default.readFileSync(filepath);
        }
        data[Date.now()] = datum;
        jsonfile_1.default.writeFileSync(filepath, data);
    }
}
exports.default = DataLogger;
//# sourceMappingURL=DataLogger.js.map
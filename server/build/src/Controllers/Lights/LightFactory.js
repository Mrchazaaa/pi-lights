"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Light_1 = tslib_1.__importDefault(require("./Light"));
class LightFactory {
    constructor(lightPromiseTimeout) {
        this.lightPromiseTimeout = lightPromiseTimeout;
    }
    createLight(address) {
        return new Light_1.default(address, this.lightPromiseTimeout);
    }
}
exports.default = LightFactory;
//# sourceMappingURL=LightFactory.js.map
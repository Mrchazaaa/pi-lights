"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LightSensor_1 = tslib_1.__importDefault(require("../../../src/Sensors/LightSensor/LightSensor"));
const onoff_1 = require("onoff");
jest.mock('onoff');
const dummyGPIONumber = 5;
let lightSensor;
beforeEach(() => {
    lightSensor = new LightSensor_1.default(dummyGPIONumber);
});
afterEach(() => {
    jest.resetAllMocks();
});
test('Creating new light sensor creates underling gpio object with the given pin number.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    expect(onoff_1.Gpio).toBeCalledTimes(1);
    expect(onoff_1.Gpio).toBeCalledWith(dummyGPIONumber, expect.anything());
}));
//# sourceMappingURL=LightSensor.test.js.map
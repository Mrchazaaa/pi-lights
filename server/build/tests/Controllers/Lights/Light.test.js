"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Light_1 = tslib_1.__importDefault(require("../../../src/Controllers/Lights/Light"));
const LightState_1 = tslib_1.__importDefault(require("../../../src/Controllers/Lights/LightState"));
const magic_home_1 = require("magic-home");
jest.mock('magic-home');
let light;
const dummyAddress = '69.69.69.69';
const dummyTimeout = 1500;
describe('tests for Light.ts', () => {
    beforeEach(() => {
        light = new Light_1.default(dummyAddress, dummyTimeout);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    test('Creating a new light creates an underlying magic-home control with the given address.', () => {
        expect(magic_home_1.Control).toBeCalledTimes(1);
        expect(magic_home_1.Control).toBeCalledWith(dummyAddress, expect.anything());
        expect(light.address).toEqual(dummyAddress);
    });
    test('Getting lights cached on state returns true if the last operation was turn on.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const mockedControlInstance = getMockInstances(magic_home_1.Control)[0];
        mockedControlInstance.turnOn.mockResolvedValue(true);
        yield light.turnOnAsync();
        expect(mockedControlInstance.turnOn).toBeCalledTimes(1);
        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState_1.default.On);
    }));
    test('Getting lights cached on state returns false if the last operation was turn off.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const mockedControlInstance = getMockInstances(magic_home_1.Control)[0];
        mockedControlInstance.turnOff.mockResolvedValue(true);
        yield light.turnOffAsync();
        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState_1.default.Off);
    }));
    test('Getting lights cached on state returns unknown if turning off lights failed.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const mockedControlInstance = getMockInstances(magic_home_1.Control)[0];
        mockedControlInstance.turnOff.mockResolvedValue(false);
        yield light.turnOffAsync();
        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState_1.default.Unknown);
    }));
    test('Getting lights cached on state returns unknown if turning on lights failed.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const mockedControlInstance = getMockInstances(magic_home_1.Control)[0];
        mockedControlInstance.turnOn.mockResolvedValue(false);
        yield light.turnOnAsync();
        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState_1.default.Unknown);
    }));
    test('Querying lights state when light is on updates cached light state to lights on.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const mockedControlInstance = getMockInstances(magic_home_1.Control)[0];
        mockedControlInstance.queryState.mockResolvedValue({ on: true });
        yield light.areLightsOnAsync();
        expect(mockedControlInstance.queryState).toBeCalledTimes(1);
        expect(light.getCachedOnState()).toEqual(LightState_1.default.On);
    }));
    test('Querying lights state when light is off updates cached light state to lights off.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const mockedControlInstance = getMockInstances(magic_home_1.Control)[0];
        mockedControlInstance.queryState.mockResolvedValue({ on: false });
        yield light.areLightsOnAsync();
        expect(mockedControlInstance.queryState).toBeCalledTimes(1);
        expect(light.getCachedOnState()).toEqual(LightState_1.default.Off);
    }));
    test('When light request exceeds timeout, error is thrown', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const mockedControlInstance = getMockInstances(magic_home_1.Control)[0];
        mockedControlInstance.turnOn.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(true), dummyTimeout * 2);
            });
        });
        yield expect(light.turnOnAsync()).rejects.toThrow();
    }));
});
function getMockInstances(mockedValue) {
    return mockedValue.mock.instances;
}
//# sourceMappingURL=Light.test.js.map
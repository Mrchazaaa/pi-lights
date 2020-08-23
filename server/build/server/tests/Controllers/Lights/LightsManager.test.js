"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LightsManager_1 = tslib_1.__importDefault(require("../../../src/Controllers/Lights/LightsManager"));
const LightFactory_1 = tslib_1.__importDefault(require("../../../src/Controllers/Lights/LightFactory"));
const magic_home_1 = require("magic-home");
jest.mock('magic-home');
jest.mock('../../../src/Controllers/Lights/LightFactory');
let lightsManager;
const dummyDiscoverTimeout = 500;
const dummyMaxLights = 5;
const mockLightFactory = new LightFactory_1.default(10000);
describe('Tests for LightsManager.', () => {
    beforeEach(() => {
        lightsManager = new LightsManager_1.default(dummyDiscoverTimeout, dummyMaxLights, mockLightFactory);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    test('Discovering lights discovers lights via magic home discover service.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        magic_home_1.Discovery.scan = jest.fn().mockResolvedValue([]);
        yield lightsManager.discoverDevices();
        expect(magic_home_1.Discovery.scan).toBeCalledTimes(1);
    }));
    test('Gettings lights gets discovered lights.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const dummyAddresses = ['num1', 'num2'];
        magic_home_1.Discovery.scan = jest.fn().mockResolvedValue(dummyAddresses.map(x => { return { address: x }; }));
        mockLightFactory.createLight = jest.fn().mockImplementation(address => { {
            return { address };
        } });
        yield lightsManager.discoverDevices();
        const result = lightsManager.getLights();
        expect(mockLightFactory.createLight).toBeCalled();
        expect(result.length).toBe(2);
        expect(result[0].address).toBe(dummyAddresses[0]);
        expect(result[1].address).toBe(dummyAddresses[1]);
    }));
    test('Are all lights discovered returns false if not max lights have been discovered.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const dummyAddresses = Array(dummyMaxLights + 1).fill('a').map((_, index) => index);
        magic_home_1.Discovery.scan = jest.fn().mockResolvedValue(dummyAddresses.map(x => { return { address: x }; }));
        mockLightFactory.createLight = jest.fn().mockImplementation(address => { {
            return { address };
        } });
        yield lightsManager.discoverDevices();
        expect(lightsManager.areAllLightsDiscovered()).toBe(false);
    }));
    test('Are all lights discovered returns true if max lights have been discovered.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const dummyAddresses = new Array(dummyMaxLights).fill('a').map((_, index) => index);
        magic_home_1.Discovery.scan = jest.fn().mockResolvedValue(dummyAddresses.map(x => { return { address: x }; }));
        mockLightFactory.createLight = jest.fn().mockImplementation(address => { {
            return { address };
        } });
        yield lightsManager.discoverDevices();
        expect(lightsManager.areAllLightsDiscovered()).toBe(true);
    }));
});
function getMockInstances(mockedValue) {
    return mockedValue.mock.instances;
}
//# sourceMappingURL=LightsManager.test.js.map
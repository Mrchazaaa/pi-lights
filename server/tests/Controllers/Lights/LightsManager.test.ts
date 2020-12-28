import LightsManager, { ILightsManager } from '../../../src/Controllers/Lights/LightsManager';
import LightFactory, { ILightFactory } from '../../../src/Controllers/Lights/LightFactory';
import { Discovery } from 'magic-home';

jest.mock('magic-home');
jest.mock('../../../src/Controllers/Lights/LightFactory');

let lightsManager: ILightsManager;
const dummyDiscoverTimeout: number = 500;
const dummyMaxLights: number = 5;

const mockLightFactory: ILightFactory = new LightFactory(10000);

describe('Tests for LightsManager.', () => {
    beforeEach(() => {
        lightsManager = new LightsManager(dummyDiscoverTimeout, 1000, dummyMaxLights, mockLightFactory);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Discovering lights discovers lights via magic home discover service.', async () => {
        Discovery.scan = jest.fn().mockResolvedValue([]);

        await lightsManager.discoverDevicesAsync();

        expect(Discovery.scan).toBeCalledTimes(1);
    });

    test('Gettings lights gets discovered lights.', async () => {
        const dummyAddresses = ['num1', 'num2'];
        Discovery.scan = jest.fn().mockResolvedValue(dummyAddresses.map(x => { return { address: x } }));

        mockLightFactory.createLight = jest.fn().mockImplementation(address => { { return { address } } });

        await lightsManager.discoverDevicesAsync();
        const result = lightsManager.getLights();

        expect(mockLightFactory.createLight).toBeCalled();

        expect(result.length).toBe(2);
        expect(result[0].address).toBe(dummyAddresses[0]);
        expect(result[1].address).toBe(dummyAddresses[1]);
    });

    test('Are all lights discovered returns false if not max lights have been discovered.', async () => {
        const dummyAddresses = Array(dummyMaxLights + 1).fill('a').map((_, index) => index);
        Discovery.scan = jest.fn().mockResolvedValue(dummyAddresses.map(x => { return { address: x } }));

        mockLightFactory.createLight = jest.fn().mockImplementation(address => { { return { address } } });

        await lightsManager.discoverDevicesAsync();

        expect(lightsManager.areAllLightsDiscovered()).toBe(false);
    });

    test('Are all lights discovered returns true if max lights have been discovered.', async () => {
        const dummyAddresses = new Array(dummyMaxLights).fill('a').map((_, index) => index);
        Discovery.scan = jest.fn().mockResolvedValue(dummyAddresses.map(x => { return { address: x } }));

        mockLightFactory.createLight = jest.fn().mockImplementation(address => { { return { address } } });

        await lightsManager.discoverDevicesAsync();

        expect(lightsManager.areAllLightsDiscovered()).toBe(true);
    });
});

function getMockInstances<TValue>(mockedValue: TValue): jest.Mocked<TValue>[] {
    return ((mockedValue as unknown) as jest.Mock).mock.instances as jest.Mocked<TValue>[];
}
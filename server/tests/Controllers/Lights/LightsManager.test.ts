import LightsManager, { ILightsManager } from '../../../src/Controllers/Lights/LightsManager';
import LightFactory, { ILightFactory } from '../../../src/Controllers/Lights/LightFactory';
import { Discovery } from 'magic-home';
import RateLimitedOperation from '../../../src/Utilities/RateLimitedOperation';

jest.mock('magic-home');
jest.mock('../../../src/Controllers/Lights/LightFactory');
jest.mock('../../../src/Utilities/RateLimitedOperation');

let lightsManager: ILightsManager;
const dummyDiscoveryRateLimit: number = 500;
const dummyMaxLights: number = 5;

const mockLightFactory: ILightFactory = new LightFactory(10000);

describe('Tests for LightsManager.', () => {
    beforeEach(() => {
        (RateLimitedOperation as jest.Mock<RateLimitedOperation<Promise<void>>>).mockImplementationOnce((op: () => Promise<void>, timeout: number) => ({ execute: op } as RateLimitedOperation<Promise<void>>));

        lightsManager = new LightsManager(dummyDiscoveryRateLimit, dummyMaxLights, mockLightFactory);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Creating a new light creates an underlying rate limited operation, for the given sensors read method.', () => {
        expect(RateLimitedOperation).toBeCalledTimes(1);
        expect(RateLimitedOperation).toHaveBeenLastCalledWith(expect.any(Function), dummyDiscoveryRateLimit);
    });

    test('Discovering lights executes underling rate limited operation.', async () => {
        Discovery.scan = jest.fn().mockResolvedValue([]);

        await lightsManager.discoverDevicesAsync();

        expect(Discovery.scan).toBeCalledTimes(1);
    });

    test('Discovering lights, when max lights have already been discovered, does not execute underling rate limited operation.', async () => {
        const dummyAddresses = ['lightAddress1', 'lightAddress2', 'lightAddress3', 'lightAddress4', 'lightAddress5'];
        await setupLightsManagerToDiscoverLights(dummyAddresses);

        expect(Discovery.scan).toBeCalledTimes(1);

        await lightsManager.discoverDevicesAsync();

        expect(Discovery.scan).toBeCalledTimes(1);
    });

    test('Removing light removes light from cache.', async () => {
        const addressToRemove = 'lightAddress3';

        const dummyAddresses = ['lightAddress1', 'lightAddress2', addressToRemove, 'lightAddress4', 'lightAddress5'];
        await setupLightsManagerToDiscoverLights(dummyAddresses);

        expect(lightsManager.getLights().map(x => x.address)).toEqual(dummyAddresses);

        lightsManager.removeLight(addressToRemove);

        expect(lightsManager.getLights().map(x => x.address)).toEqual(dummyAddresses.filter(x => x !== addressToRemove));
    });

    test('Gettings lights gets discovered lights.', async () => {
        const dummyAddresses = ['lightAddress1', 'lightAddress2'];
        await setupLightsManagerToDiscoverLights(dummyAddresses);

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

async function setupLightsManagerToDiscoverLights(lightAddresses: string[]) {
    Discovery.scan = jest.fn().mockResolvedValue(lightAddresses.map(x => { return { address: x } }));
    mockLightFactory.createLight = jest.fn().mockImplementation(address => { { return { address } } });

    await lightsManager.discoverDevicesAsync();
}
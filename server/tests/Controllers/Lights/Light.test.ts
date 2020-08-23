import Light from '../../../src/Controllers/Lights/Light';
import LightState from '../../../src/Controllers/Lights/LightState';
import ILight from '../../../src/Controllers/Lights/ILight';
import { Control } from 'magic-home';

jest.mock('magic-home');

let light: ILight;
const dummyAddress: string = '69.69.69.69';
const dummyTimeout: number = 1500;

describe('tests for Light.ts', () => {
    beforeEach(() => {
        light = new Light(dummyAddress, dummyTimeout);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Creating a new light creates an underlying magic-home control with the given address.', () => {
        expect(Control).toBeCalledTimes(1);
        expect(Control).toBeCalledWith(dummyAddress, expect.anything());
        expect(light.address).toEqual(dummyAddress);
    });

    test('Getting lights cached on state returns true if the last operation was turn on.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.turnOn.mockResolvedValue(true);

        await light.turnOnAsync();

        expect(mockedControlInstance.turnOn).toBeCalledTimes(1);
        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState.On);
    });

    test('Getting lights cached on state returns false if the last operation was turn off.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.turnOff.mockResolvedValue(true);

        await light.turnOffAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState.Off);
    });

    test('Getting lights cached on state returns unknown if turning off lights failed.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.turnOff.mockResolvedValue(false);

        await light.turnOffAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState.Unknown);
    });

    test('Getting lights cached on state returns unknown if turning on lights failed.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.turnOn.mockResolvedValue(false);

        await light.turnOnAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(0);
        expect(light.getCachedOnState()).toEqual(LightState.Unknown);
    });

    test('Querying lights state when light is on updates cached light state to lights on.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.queryState.mockResolvedValue({ on: true });

        await light.areLightsOnAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(1);
        expect(light.getCachedOnState()).toEqual(LightState.On);
    });

    test('Querying lights state when light is off updates cached light state to lights off.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.queryState.mockResolvedValue({ on: false });

        await light.areLightsOnAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(1);
        expect(light.getCachedOnState()).toEqual(LightState.Off);
    });

    test('When light request exceeds timeout, error is thrown', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];

        mockedControlInstance.turnOn.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(true), dummyTimeout*2)
            });
        });

        await expect(light.turnOnAsync()).rejects.toThrow()
    });
});

function getMockInstances<TValue>(mockedValue: TValue): jest.Mocked<TValue>[] {
    return ((mockedValue as unknown) as jest.Mock).mock.instances as jest.Mocked<TValue>[];
}
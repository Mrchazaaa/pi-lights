import Light from '../../../src/Controllers/Lights/Light';
import LightState from '../../../src/Controllers/Lights/LightState';
import ILight from '../../../src/Controllers/Lights/ILight';
import { Control } from 'magic-home';
import { getMockInstances } from '../../TestUtilities';

jest.mock('magic-home');

let light: ILight;
const dummyAddress: string = '69.69.69.69';
const dummyTimeout: number = 1500;

describe('Tests for Light.', () => {
    beforeEach(() => {
        light = new Light(dummyAddress, dummyTimeout);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Turning on light turns on light.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.turnOn.mockResolvedValue(true);

        await light.turnOnAsync();

        expect(mockedControlInstance.turnOn).toBeCalledTimes(1);
    });

    test('Turning off light turns off light.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.turnOff.mockResolvedValue(true);

        await light.turnOffAsync();

        expect(mockedControlInstance.turnOff).toBeCalledTimes(1);
    });

    test('Switching light to strobe, switches light to strobe.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.setPattern.mockResolvedValue(true);

        await light.setStrobeAsync();

        expect(mockedControlInstance.setPattern).toBeCalledTimes(1);
        expect(mockedControlInstance.setPattern).toBeCalledWith('seven_color_strobe_flash', 100);
    });

    test('Switching light to ambient, switches light to ambient.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.setColor.mockResolvedValue(true);

        await light.setAmbientAsync();

        expect(mockedControlInstance.setColor).toBeCalledTimes(1);
        expect(mockedControlInstance.setColor).toBeCalledWith(51, 0, 0);
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

        await light.updateStateCacheAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(1);
        expect(light.getCachedOnState()).toEqual(LightState.On);
    });

    test('Querying lights state when light is off updates cached light state to lights off.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.queryState.mockResolvedValue({ on: false });

        await light.updateStateCacheAsync();

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

    test('Toggling light, turns light on if light is off.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.queryState.mockResolvedValue({ on: false });

        await light.toggleAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(1);
        expect(mockedControlInstance.turnOff).toBeCalledTimes(0);
        expect(mockedControlInstance.turnOn).toBeCalledTimes(1);
    });

    test('Toggling light, turns light off if light is on.', async () => {
        const mockedControlInstance = getMockInstances(Control)[0];
        mockedControlInstance.queryState.mockResolvedValue({ on: true });

        await light.toggleAsync();

        expect(mockedControlInstance.queryState).toBeCalledTimes(1);
        expect(mockedControlInstance.turnOn).toBeCalledTimes(0);
        expect(mockedControlInstance.turnOff).toBeCalledTimes(1);
    });
});
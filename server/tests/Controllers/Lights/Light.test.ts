import Light from '../../../src/Controllers/Lights/Light';
import LightState from '../../../src/Controllers/Lights/LightState';
import ILight from '../../../src/Controllers/Lights/ILight';
import { Control, IControl } from 'magic-home';

jest.mock('magic-home');
Control.ackMask = jest.fn();

let light: ILight;
let dummyAddress: string = "69.69.69.69";
let dummyTimeout: number = 1500;


describe('Light tests', () => {
    beforeEach(() => {
        light = new Light({address: dummyAddress}, dummyTimeout);
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
        const mockedControlInstance = (((Control as unknown) as jest.Mock).mock.instances[0]) as jest.Mocked<IControl>
        mockedControlInstance.turnOn.mockResolvedValue(true);
        await light.turnOnAsync();
        mockedControlInstance.queryState.mockResolvedValue({ on: false });
        expect(light.getCachedOnState()).toEqual(LightState.On);
    });
});
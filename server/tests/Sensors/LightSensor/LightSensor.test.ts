import LightSensor, { ISensor } from '../../../src/Sensors/LightSensor/LightSensor';
import { Gpio } from 'onoff';

jest.mock('onoff');

const dummyGPIONumber: number = 5;

let lightSensor: ISensor;

beforeEach(() => {
    lightSensor = new LightSensor(dummyGPIONumber);
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Creating new light sensor creates underling gpio object with the given pin number.', async () => {
    expect(Gpio).toBeCalledTimes(1);
    expect(Gpio).toBeCalledWith(dummyGPIONumber, expect.anything());
});
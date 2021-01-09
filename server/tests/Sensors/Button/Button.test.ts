import { Gpio } from 'onoff';
import { mocked } from 'ts-jest/dist/util/testing';
import Button from '../../../src/Sensors/Button/Button';
import { getLastMockInstance, getMockInstances } from '../../TestUtilities';

jest.mock("onoff");

const dummyGpioPin = 11;
const dummyCallback = jest.fn();
const dummyDebounceTime = 100;

var buttonPressCallback: (error, _) => Promise<void>;
var button: Button;

describe('Tests for Button.', () => {
    beforeEach(() => {
        button = new Button(dummyGpioPin, dummyCallback, dummyDebounceTime);
        const mockedGpioButtonInstance = getLastMockInstance(Gpio) as any as Gpio;
        buttonPressCallback = (mockedGpioButtonInstance.watch as jest.Mock).mock.calls[0][0];
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Creating button sets button press listener.', async () => {
        expect(Gpio).toBeCalledTimes(1);
        expect(Gpio).toBeCalledWith(dummyGpioPin, 'in', 'falling', {"debounceTimeout": dummyDebounceTime});

        const mockedGpioButtonInstance = getLastMockInstance(Gpio) as any as Gpio;
        expect(mockedGpioButtonInstance.watch).toBeCalledTimes(1);
    });

    test('Firing of gpio listener, executes button press callback.', async () => {
        await buttonPressCallback(null, null);

        expect(dummyCallback).toBeCalledTimes(1);
    });

    test('Firing of gpio listener, with error, does not execute button press callback.', async () => {
        await buttonPressCallback(Error("AAAGHH SCARY ERROR"), null);

        expect(dummyCallback).toBeCalledTimes(0);
    });

    test('Disposing button unexports inner gpio.', async () => {
        button.dispose();

        const mockedGpioButtonInstance = getLastMockInstance(Gpio) as any as Gpio;
        expect(mockedGpioButtonInstance.unexport).toBeCalledTimes(1);
    });
});
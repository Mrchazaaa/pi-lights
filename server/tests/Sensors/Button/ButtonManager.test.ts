import Button, { IButton } from '../../../src/Sensors/Button/Button';
import ButtonManager from '../../../src/Sensors/Button/ButtonManager';
import LightsManager, { ILightsManager, ILight } from '../../../src/Controllers/Lights/LightsManager';
import { getLastMockInstance, getMockInstances } from '../../TestUtilities';
import {IMock, Mock, Times} from 'typemoq'
import { mocked } from 'ts-jest/dist/util/testing';

jest.mock('../../../src/Sensors/Button/Button');

const dummyGpioPin = 11;
const dummyCallback = jest.fn();
const dummyDebounceTime = 100;

let mockLight1: IMock<ILight>;
let mockLight2: IMock<ILight>;
let mockLightsManager: IMock<ILightsManager>;

// let buttonPressCallback: (error, _) => Promise<void>;
let buttonManager: ButtonManager;

describe('Tests for Button.', () => {
    beforeEach(() => {
        mockLightsManager = Mock.ofType<ILightsManager>();
        mockLight1 = Mock.ofType<ILight>();
        mockLight2 = Mock.ofType<ILight>();
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLight1.object, mockLight2.object]);
        buttonManager = new ButtonManager(mockLightsManager.object);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Dispoing button manager disposes all underlying buttons.', async () => {
        buttonManager.initialize();

        buttonManager.dispose();

        const mockedButtonInstances = getMockInstances(Button as jest.Mock<Button>);
        mockedButtonInstances.forEach(m => {
            expect(m.dispose).toBeCalledTimes(1);
        });
    });

    test('Dispoing button manager, before initializing, does nothing.', async () => {
        buttonManager.dispose();

        expect(getMockInstances(Button as jest.Mock<Button>).length).toEqual(0);
    });

    test('Initializing creates underlying buttons.', async () => {
        expect(Button).toBeCalledTimes(0);

        buttonManager.initialize();

        expect(Button).toBeCalledTimes(2);
    });

    test('Callback passed to initialized buttons, toggles lights.', async () => {
        buttonManager.initialize();

        var toggleLightsCallback = (Button as jest.Mock).mock.calls[0][2];
        toggleLightsCallback();

        mockLight1.verify(l => l.toggleAsync(), Times.once());
        mockLight2.verify(l => l.toggleAsync(), Times.once());
    });

    test('Callback passed to initialized buttons, sets strobe light.', async () => {
        buttonManager.initialize();

        var toggleLightsCallback = (Button as jest.Mock).mock.calls[1][2];
        toggleLightsCallback();

        mockLight1.verify(l => l.setStrobeAsync(), Times.once());
        mockLight2.verify(l => l.setStrobeAsync(), Times.once());
    });
});
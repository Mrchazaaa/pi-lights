import Button, { IButton } from '../../../src/Sensors/Button/Button';
import ButtonManager from '../../../src/Sensors/Button/ButtonManager';
import LightsManager, { ILightsManager } from '../../../src/Controllers/Lights/LightsManager';
import { getLastMockInstance, getMockInstances } from '../../TestUtilities';
import {IMock, Mock, Times} from 'typemoq'

jest.mock('../../../src/Sensors/Button/Button');

const dummyGpioPin = 11;
const dummyCallback = jest.fn();
const dummyDebounceTime = 100;

let mockLightsManager: IMock<ILightsManager>;

// let buttonPressCallback: (error, _) => Promise<void>;
let buttonManager: ButtonManager;

describe('Tests for Button.', () => {
    beforeEach(() => {
        mockLightsManager = Mock.ofType<ILightsManager>();
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
});
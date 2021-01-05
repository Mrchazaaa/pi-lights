import App from '../src/App';
import ButtonManager from '../src/Sensors/Button/ButtonManager';
import LightSensingLightSwitcher from '../src/Services/LightSensingLightSwitcher';
import { getMockInstances } from './TestUtilities';

jest.mock('../src/Sensors/Button/ButtonManager');
jest.mock('../src/Services/LightSensingLightSwitcher');

let app: App;

describe('Tests for App.', () => {
    beforeEach(() => {
        app = new App();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Disposing not started control loop does nothing.', () => {
        app.dispose();

        const mockedLightSensingLightSwitcher = getMockInstances(LightSensingLightSwitcher as jest.Mock<LightSensingLightSwitcher>)[0];
        const mockedButtonManager = getMockInstances(ButtonManager as jest.Mock<ButtonManager>)[0];

        expect(mockedLightSensingLightSwitcher.dispose).toBeCalledTimes(1);
        expect(mockedLightSensingLightSwitcher.runControlLoop).toBeCalledTimes(0);
        expect(mockedButtonManager.dispose).toBeCalledTimes(1);
        expect(mockedButtonManager.initialize).toBeCalledTimes(0);
    });

    test('Disposing cancels running control loop.', async () => {
        const mockedLightSensingLightSwitcher = getMockInstances(LightSensingLightSwitcher as jest.Mock<LightSensingLightSwitcher>)[0];
        const mockedButtonManager = getMockInstances(ButtonManager as jest.Mock<ButtonManager>)[0];

        mockedLightSensingLightSwitcher.runControlLoop.mockImplementation(async () => {
            app.dispose();
        });

        await app.start();

        expect(mockedLightSensingLightSwitcher.dispose).toBeCalledTimes(1);
        expect(mockedLightSensingLightSwitcher.runControlLoop).toBeCalledTimes(1);
        expect(mockedButtonManager.dispose).toBeCalledTimes(1);
        expect(mockedButtonManager.initialize).toBeCalledTimes(1);
    });
});
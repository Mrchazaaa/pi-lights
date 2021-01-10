import LightSensingLightSwitcher from '../../src/Services/LightSensingLightSwitcher';
import ILightSensingLightSwitcher from '../../src/Services/ILightSensingLightSwitcher';
import ILightsManager from '../../src/Controllers/Lights/ILightsManager';
import ILight from '../../src/Controllers/Lights/ILight';
import ISensor from '../../src/Sensors/ISensor';
import LightState from '../../src/Controllers/Lights/LightState';
import {IMock, Mock, Times} from 'typemoq'

let lightSensingLightSwitch: ILightSensingLightSwitcher;

let mockLightSensor: IMock<ISensor<number>>;
let mockLightsManager: IMock<ILightsManager>;
let mockLightWithUnknownState: IMock<ILight>;
let mockLightWithOnState: IMock<ILight>;
let mockLightWithOffState: IMock<ILight>;

const dummyLightThreshhold = 195;

describe('Tests for LightSensingLightSwitcher.', () => {
    beforeEach(() => {
        mockLightSensor = Mock.ofType<ISensor<number>>();
        mockLightsManager = Mock.ofType<ILightsManager>();
        mockLightWithUnknownState = Mock.ofType<ILight>();
        mockLightWithUnknownState.setup(l => l.getCachedOnState()).returns(() => LightState.Unknown);
        mockLightWithOnState = Mock.ofType<ILight>();
        mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState.On);
        mockLightWithOffState = Mock.ofType<ILight>();
        mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState.Off);

        lightSensingLightSwitch = new LightSensingLightSwitcher(mockLightsManager.object, mockLightSensor.object, dummyLightThreshhold);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Light with unknown state fetches light state.', async () => {
        mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object, mockLightWithOnState.object, mockLightWithUnknownState.object]);

        await lightSensingLightSwitch.runControlLoop();

        mockLightWithOffState.verify(l => l.updateStateCacheAsync(), Times.never());
        mockLightWithOnState.verify(l => l.updateStateCacheAsync(), Times.never());
        mockLightWithUnknownState.verify(l => l.updateStateCacheAsync(), Times.once());
    });

    test('When all lights haven\'t been discovered, lights are discovered.', async () => {
        mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => false);
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [Mock.ofType<ILight>().object]);

        await lightSensingLightSwitch.runControlLoop();

        mockLightsManager.verify(lm => lm.discoverDevicesAsync(), Times.once());
    });

    test('If it is dark, and cached light state is off, lights are turned on.', async () => {
        mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);

        setRoomAsDark(true);
        await lightSensingLightSwitch.runControlLoop();

        mockLightSensor.verify(l => l.getReadingAsync(), Times.once());
        mockLightWithOffState.verify(l => l.setAmbientAsync(), Times.once());
    });

    test('If it is dark, and cached light state is already on, lights are not turned on.', async () => {
        mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
        mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState.On);
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);
        setRoomAsDark(true);

        await lightSensingLightSwitch.runControlLoop();

        mockLightSensor.verify(l => l.getReadingAsync(), Times.once());
        mockLightWithOnState.verify(l => l.setAmbientAsync(), Times.never());
    });

    test('If it is light, and cached light state is on, lights are turned off.', async () => {
        mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);
        setRoomAsDark(false);

        await lightSensingLightSwitch.runControlLoop();

        mockLightSensor.verify(l => l.getReadingAsync(), Times.once());
        mockLightWithOnState.verify(l => l.turnOffAsync(), Times.once());
    });

    test('If it is light, and cached light state is already off, lights are turned not turned off.', async () => {
        mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);
        setRoomAsDark(false);

        await lightSensingLightSwitch.runControlLoop();

        mockLightSensor.verify(l => l.getReadingAsync(), Times.once());
        mockLightWithOffState.verify(l => l.turnOffAsync(), Times.never());
    });

    test('If light state is unknown, and the light state is unavailable, no action is taken.', async () => {
        mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
        mockLightWithUnknownState.setup(l => l.updateStateCacheAsync()).throws(new Error('Timeout'));
        mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithUnknownState.object]);

        await lightSensingLightSwitch.runControlLoop();

        mockLightSensor.verify(m => m.getReadingAsync(), Times.never());
        mockLightWithUnknownState.verify(l => l.turnOffAsync(), Times.never());
        mockLightWithUnknownState.verify(l => l.setAmbientAsync(), Times.never());
    });

    test('Disposing switcher disposes inner sensor.', async () => {
        await lightSensingLightSwitch.dispose();

        mockLightSensor.verify(m => m.dispose(), Times.once());
    });
});

function setRoomAsDark(dark: boolean) {
    mockLightSensor.setup(x => x.getReadingAsync()).returns(() => {
        return new Promise(res => res( dark ? dummyLightThreshhold - 1 : dummyLightThreshhold + 1 ))
    });
}
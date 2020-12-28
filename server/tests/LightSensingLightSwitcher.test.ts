import LightSensingLightSwitcher from '../src/LightSensingLightSwitcher';
import ILightSensingLightSwitcher from '../src/ILightSensingLightSwitcher';
import ILightsManager from '../src/Controllers/Lights/ILightsManager';
import ILight from '../src/Controllers/Lights/ILight';
import ISensor from '../src/Sensors/ISensor';
import LightState from '../src/Controllers/Lights/LightState';
import {IMock, Mock, Times} from 'typemoq'

interface TLightData {
    ambient: number
}

let lightSensingLightSwitch: ILightSensingLightSwitcher;

let mockMeanSensorFilter: IMock<ISensor<TLightData>>;
let mockLightsManager: IMock<ILightsManager>;
const dummyThreshhold = 195;

beforeEach(() => {
    mockMeanSensorFilter = Mock.ofType<ISensor<TLightData>>();
    mockLightsManager = Mock.ofType<ILightsManager>();

    lightSensingLightSwitch = new LightSensingLightSwitcher(mockLightsManager.object, mockMeanSensorFilter.object, dummyThreshhold);
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Cancelling not started control loop does nothing.', () => {
    lightSensingLightSwitch.cancelControlLoop();

    mockMeanSensorFilter.verify(e => e.getReadingAsync(), Times.never());
    mockLightsManager.verify(e => e.areAllLightsDiscovered(), Times.never());
    mockLightsManager.verify(e => e.discoverDevicesAsync(), Times.never());
    mockLightsManager.verify(e => e.getLights(), Times.never());
});

test('Cancel control loop cancels running control loop.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => {
        lightSensingLightSwitch.cancelControlLoop();
        return true
    });

    const mockLight = Mock.ofType<ILight>();
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLight.object]);

    await lightSensingLightSwitch.runControlLoopAsync();
});

test('Light with unknown state fetches light state.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithUnknownState = Mock.ofType<ILight>();
    mockLightWithUnknownState.setup(l => l.getCachedOnState()).returns(() => LightState.Unknown);
    const mockLightWithOnState = Mock.ofType<ILight>();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState.On);
    const mockLightWithOffState = Mock.ofType<ILight>();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object, mockLightWithOnState.object, mockLightWithUnknownState.object]);

    setRoomAsDark(false);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOffState.verify(l => l.updateStateCacheAsync(), Times.never());
    mockLightWithOnState.verify(l => l.updateStateCacheAsync(), Times.never());
    mockLightWithUnknownState.verify(l => l.updateStateCacheAsync(), Times.once());
});

test.only('When all lights haven\'t been discovered, lights are discovered.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => false);

    mockLightsManager.setup(lm => lm.discoverDevicesAsync()).returns(async () => {
        lightSensingLightSwitch.cancelControlLoop();
    });

    mockLightsManager.setup(lm => lm.getLights()).returns(() => [Mock.ofType<ILight>().object]);

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightsManager.verify(lm => lm.discoverDevicesAsync(), Times.once());
});

test('If it is dark, and cached light state is off, lights are turned on.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOffState = Mock.ofType<ILight>();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);

    setRoomAsDark(true);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOffState.verify(l => l.turnOnAsync(), Times.once());
});

test('If it is dark, and cached light state is already on, lights are not turned on.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOnState = Mock.ofType<ILight>();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState.On);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);

    setRoomAsDark(true);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOnState.verify(l => l.turnOnAsync(), Times.never());
});

test('If it is light, and cached light state is on, lights are turned off.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOnState = Mock.ofType<ILight>();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState.On);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);

    setRoomAsDark(false);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOnState.verify(l => l.turnOffAsync(), Times.once());
});

test('If it is light, and cached light state is already off, lights are turned not turned off.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOffState = Mock.ofType<ILight>();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);

    setRoomAsDark(false);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOffState.verify(l => l.turnOffAsync(), Times.never());
});

test('If light state is unknown, and the light state is unavailable, no action is taken.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithUnknownState = Mock.ofType<ILight>();
    mockLightWithUnknownState.setup(l => l.getCachedOnState()).returns(() => {
        lightSensingLightSwitch.cancelControlLoop();
        return LightState.Unknown
    });
    mockLightWithUnknownState.setup(l => l.updateStateCacheAsync()).throws(new Error('Timeout'));
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithUnknownState.object]);

    await lightSensingLightSwitch.runControlLoopAsync();

    mockMeanSensorFilter.verify(m => m.getReadingAsync(), Times.never());
    mockLightWithUnknownState.verify(l => l.turnOffAsync(), Times.never());
    mockLightWithUnknownState.verify(l => l.turnOnAsync(), Times.never());
});

function setRoomAsDark(dark: boolean) {
    mockMeanSensorFilter.setup(x => x.getReadingAsync()).returns(() => {
        return new Promise(res => res( { ambient: dark ? dummyThreshhold+1 : dummyThreshhold - 1 } ))
    });
}
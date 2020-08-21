import LightSensingLightSwitcher from '../src/LightSensingLightSwitcher';
import ILightSensingLightSwitcher from '../src/ILightSensingLightSwitcher';
import ILightsManager from '../src/Controllers/Lights/ILightsManager';
import IAveragingLightSensorsManager from '../src/Sensors/LightSensor/IAveragingLightSensorsManager';
import ILight from '../src/Controllers/Lights/ILight';
import LightState from '../src/Controllers/Lights/LightState';
import {IMock, Mock, Times} from 'typemoq'

let lightSensingLightSwitch: ILightSensingLightSwitcher;

let mockAveragingLightSensorsManager: IMock<IAveragingLightSensorsManager>;
let mockLightsManager: IMock<ILightsManager>;

beforeEach(() => {
    mockAveragingLightSensorsManager = Mock.ofType<IAveragingLightSensorsManager>();
    mockLightsManager = Mock.ofType<ILightsManager>();

    lightSensingLightSwitch = new LightSensingLightSwitcher(mockLightsManager.object, mockAveragingLightSensorsManager.object);
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Cancelling not started control loop does nothing.', () => {
    lightSensingLightSwitch.cancelControlLoop();

    mockAveragingLightSensorsManager.verify(e => e.isDarkAsync(), Times.never());
    mockLightsManager.verify(e => e.areAllLightsDiscovered(), Times.never());
    mockLightsManager.verify(e => e.discoverDevices(), Times.never());
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

    mockAveragingLightSensorsManager.setup(m => m.isDarkAsync()).returns(async () => {
        lightSensingLightSwitch.cancelControlLoop();
        return false;
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOffState.verify(l => l.areLightsOnAsync(), Times.never());
    mockLightWithOnState.verify(l => l.areLightsOnAsync(), Times.never());
    mockLightWithUnknownState.verify(l => l.areLightsOnAsync(), Times.once());
});

test("When all lights haven't been discovered, lights are discovered.", async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => false);

    mockLightsManager.setup(lm => lm.discoverDevices()).returns(async () => {
        lightSensingLightSwitch.cancelControlLoop();
    });

    mockLightsManager.setup(lm => lm.getLights()).returns(() => [Mock.ofType<ILight>().object]);

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightsManager.verify(lm => lm.discoverDevices(), Times.once());
});

test('If it is dark, and cached light state is off, lights are turned on.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOffState = Mock.ofType<ILight>();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);

    mockAveragingLightSensorsManager.setup(m => m.isDarkAsync()).returns(async () => {
        lightSensingLightSwitch.cancelControlLoop();
        return true;
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOffState.verify(l => l.turnOnAsync(), Times.once());
});

test('If it is dark, and cached light state is already on, lights are not turned on.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOnState = Mock.ofType<ILight>();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState.On);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);

    mockAveragingLightSensorsManager.setup(m => m.isDarkAsync()).returns(async () => {
        lightSensingLightSwitch.cancelControlLoop();
        return true;
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOnState.verify(l => l.turnOnAsync(), Times.never());
});

test('If it is light, and cached light state is on, lights are turned off.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOnState = Mock.ofType<ILight>();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState.On);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);

    mockAveragingLightSensorsManager.setup(m => m.isDarkAsync()).returns(async () => {
        lightSensingLightSwitch.cancelControlLoop();
        return false;
    });

    await lightSensingLightSwitch.runControlLoopAsync();

    mockLightWithOnState.verify(l => l.turnOffAsync(), Times.once());
});

test('If it is light, and cached light state is already off, lights are turned not turned off.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    const mockLightWithOffState = Mock.ofType<ILight>();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);

    mockAveragingLightSensorsManager.setup(m => m.isDarkAsync()).returns(async () => {
        lightSensingLightSwitch.cancelControlLoop();
        return false;
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
    mockLightWithUnknownState.setup(l => l.areLightsOnAsync()).throws(new Error("Timout"));
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithUnknownState.object]);

    await lightSensingLightSwitch.runControlLoopAsync();

    mockAveragingLightSensorsManager.verify(m => m.isDarkAsync(), Times.never());
    mockLightWithUnknownState.verify(l => l.turnOffAsync(), Times.never());
    mockLightWithUnknownState.verify(l => l.turnOnAsync(), Times.never());
});
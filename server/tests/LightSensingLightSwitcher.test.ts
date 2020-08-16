import LightSensingLightSwitcher from '../src/LightSensingLightSwitcher';
import ILightSensingLightSwitcher from '../src/ILightSensingLightSwitcher';
import ILightsManager from '../src/Controllers/Lights/ILightsManager';
import IAveragingLightSensorsManager from '../src/Sensors/LightSensor/IAveragingLightSensorsManager';
import ILight from '../src/Controllers/Lights/ILight';
import LightState from '../src/Controllers/Lights/LightState';
import {IMock, Mock, Times} from "typemoq"

var lightSensingLightSwitch: ILightSensingLightSwitcher;

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

    var mockLight = Mock.ofType<ILight>();
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLight.object]);

    await lightSensingLightSwitch.runControlLoopAsync();
});

test('Light with unknown state fetches light state.', async () => {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);

    var mockLightWithUnknownState = Mock.ofType<ILight>();
    mockLightWithUnknownState.setup(l => l.cachedOnstate()).returns(() => LightState.Unknown);
    var mockLightWithOnState = Mock.ofType<ILight>();
    mockLightWithOnState.setup(l => l.cachedOnstate()).returns(() => LightState.On);
    var mockLightWithOffState = Mock.ofType<ILight>();
    mockLightWithOffState.setup(l => l.cachedOnstate()).returns(() => LightState.Off);
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
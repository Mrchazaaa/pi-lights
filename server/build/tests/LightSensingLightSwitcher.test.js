"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LightSensingLightSwitcher_1 = tslib_1.__importDefault(require("../src/LightSensingLightSwitcher"));
const LightState_1 = tslib_1.__importDefault(require("../src/Controllers/Lights/LightState"));
const typemoq_1 = require("typemoq");
let lightSensingLightSwitch;
let mockMeanSensorFilter;
let mockLightsManager;
const dummyThreshhold = 195;
beforeEach(() => {
    mockMeanSensorFilter = typemoq_1.Mock.ofType();
    mockLightsManager = typemoq_1.Mock.ofType();
    lightSensingLightSwitch = new LightSensingLightSwitcher_1.default(mockLightsManager.object, mockMeanSensorFilter.object, dummyThreshhold);
});
afterEach(() => {
    jest.resetAllMocks();
});
test('Cancelling not started control loop does nothing.', () => {
    lightSensingLightSwitch.cancelControlLoop();
    mockMeanSensorFilter.verify(e => e.getReadingAsync(), typemoq_1.Times.never());
    mockLightsManager.verify(e => e.areAllLightsDiscovered(), typemoq_1.Times.never());
    mockLightsManager.verify(e => e.discoverDevices(), typemoq_1.Times.never());
    mockLightsManager.verify(e => e.getLights(), typemoq_1.Times.never());
});
test('Cancel control loop cancels running control loop.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => {
        lightSensingLightSwitch.cancelControlLoop();
        return true;
    });
    const mockLight = typemoq_1.Mock.ofType();
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLight.object]);
    yield lightSensingLightSwitch.runControlLoopAsync();
}));
test('Light with unknown state fetches light state.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
    const mockLightWithUnknownState = typemoq_1.Mock.ofType();
    mockLightWithUnknownState.setup(l => l.getCachedOnState()).returns(() => LightState_1.default.Unknown);
    const mockLightWithOnState = typemoq_1.Mock.ofType();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState_1.default.On);
    const mockLightWithOffState = typemoq_1.Mock.ofType();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState_1.default.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object, mockLightWithOnState.object, mockLightWithUnknownState.object]);
    setRoomAsDark(false);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockLightWithOffState.verify(l => l.areLightsOnAsync(), typemoq_1.Times.never());
    mockLightWithOnState.verify(l => l.areLightsOnAsync(), typemoq_1.Times.never());
    mockLightWithUnknownState.verify(l => l.areLightsOnAsync(), typemoq_1.Times.once());
}));
test.only('When all lights haven\'t been discovered, lights are discovered.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => false);
    mockLightsManager.setup(lm => lm.discoverDevices()).returns(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        lightSensingLightSwitch.cancelControlLoop();
    }));
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [typemoq_1.Mock.ofType().object]);
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockLightsManager.verify(lm => lm.discoverDevices(), typemoq_1.Times.once());
}));
test('If it is dark, and cached light state is off, lights are turned on.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
    const mockLightWithOffState = typemoq_1.Mock.ofType();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState_1.default.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);
    setRoomAsDark(true);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockLightWithOffState.verify(l => l.turnOnAsync(), typemoq_1.Times.once());
}));
test('If it is dark, and cached light state is already on, lights are not turned on.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
    const mockLightWithOnState = typemoq_1.Mock.ofType();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState_1.default.On);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);
    setRoomAsDark(true);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockLightWithOnState.verify(l => l.turnOnAsync(), typemoq_1.Times.never());
}));
test('If it is light, and cached light state is on, lights are turned off.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
    const mockLightWithOnState = typemoq_1.Mock.ofType();
    mockLightWithOnState.setup(l => l.getCachedOnState()).returns(() => LightState_1.default.On);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOnState.object]);
    setRoomAsDark(false);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockLightWithOnState.verify(l => l.turnOffAsync(), typemoq_1.Times.once());
}));
test('If it is light, and cached light state is already off, lights are turned not turned off.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
    const mockLightWithOffState = typemoq_1.Mock.ofType();
    mockLightWithOffState.setup(l => l.getCachedOnState()).returns(() => LightState_1.default.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object]);
    setRoomAsDark(false);
    mockMeanSensorFilter.setup(m => m.getReadingAsync()).callback(() => {
        lightSensingLightSwitch.cancelControlLoop();
    });
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockLightWithOffState.verify(l => l.turnOffAsync(), typemoq_1.Times.never());
}));
test('If light state is unknown, and the light state is unavailable, no action is taken.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    mockLightsManager.setup(lm => lm.areAllLightsDiscovered()).returns(() => true);
    const mockLightWithUnknownState = typemoq_1.Mock.ofType();
    mockLightWithUnknownState.setup(l => l.getCachedOnState()).returns(() => {
        lightSensingLightSwitch.cancelControlLoop();
        return LightState_1.default.Unknown;
    });
    mockLightWithUnknownState.setup(l => l.areLightsOnAsync()).throws(new Error('Timout'));
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithUnknownState.object]);
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockMeanSensorFilter.verify(m => m.getReadingAsync(), typemoq_1.Times.never());
    mockLightWithUnknownState.verify(l => l.turnOffAsync(), typemoq_1.Times.never());
    mockLightWithUnknownState.verify(l => l.turnOnAsync(), typemoq_1.Times.never());
}));
function setRoomAsDark(dark) {
    mockMeanSensorFilter.setup(x => x.getReadingAsync()).returns(() => {
        return new Promise(res => res(dark ? dummyThreshhold + 1 : dummyThreshhold - 1));
    });
}
//# sourceMappingURL=LightSensingLightSwitcher.test.js.map
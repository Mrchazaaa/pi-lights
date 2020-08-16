"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LightSensingLightSwitcher_1 = tslib_1.__importDefault(require("../src/LightSensingLightSwitcher"));
const LightState_1 = tslib_1.__importDefault(require("../src/Controllers/Lights/LightState"));
const typemoq_1 = require("typemoq");
let lightSensingLightSwitch;
let mockAveragingLightSensorsManager;
let mockLightsManager;
beforeEach(() => {
    mockAveragingLightSensorsManager = typemoq_1.Mock.ofType();
    mockLightsManager = typemoq_1.Mock.ofType();
    lightSensingLightSwitch = new LightSensingLightSwitcher_1.default(mockLightsManager.object, mockAveragingLightSensorsManager.object);
});
afterEach(() => {
    jest.resetAllMocks();
});
test('Cancelling not started control loop does nothing.', () => {
    lightSensingLightSwitch.cancelControlLoop();
    mockAveragingLightSensorsManager.verify(e => e.isDarkAsync(), typemoq_1.Times.never());
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
    mockLightWithUnknownState.setup(l => l.cachedOnstate()).returns(() => LightState_1.default.Unknown);
    const mockLightWithOnState = typemoq_1.Mock.ofType();
    mockLightWithOnState.setup(l => l.cachedOnstate()).returns(() => LightState_1.default.On);
    const mockLightWithOffState = typemoq_1.Mock.ofType();
    mockLightWithOffState.setup(l => l.cachedOnstate()).returns(() => LightState_1.default.Off);
    mockLightsManager.setup(lm => lm.getLights()).returns(() => [mockLightWithOffState.object, mockLightWithOnState.object, mockLightWithUnknownState.object]);
    mockAveragingLightSensorsManager.setup(m => m.isDarkAsync()).returns(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        lightSensingLightSwitch.cancelControlLoop();
        return false;
    }));
    yield lightSensingLightSwitch.runControlLoopAsync();
    mockLightWithOffState.verify(l => l.areLightsOnAsync(), typemoq_1.Times.never());
    mockLightWithOnState.verify(l => l.areLightsOnAsync(), typemoq_1.Times.never());
    mockLightWithUnknownState.verify(l => l.areLightsOnAsync(), typemoq_1.Times.once());
}));
//# sourceMappingURL=LightSensingLightSwitcher.test.js.map
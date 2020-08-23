"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MeanSensorFilter_1 = tslib_1.__importDefault(require("../../src/Sensors/MeanSensorFilter"));
const typemoq_1 = require("typemoq");
let meanSensorFilter;
const dummyAverageQueueSize = 5;
let mockSensors;
beforeEach(() => {
    mockSensors = [typemoq_1.Mock.ofType(), typemoq_1.Mock.ofType()];
    meanSensorFilter = new MeanSensorFilter_1.default(dummyAverageQueueSize, mockSensors.map(x => x.object));
});
afterEach(() => {
    jest.resetAllMocks();
});
test('Getting reading gets reading from all underlying sensors.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield meanSensorFilter.getReadingAsync();
    mockSensors.forEach(mockSensor => mockSensor.verify(s => s.getReadingAsync(), typemoq_1.Times.exactly(dummyAverageQueueSize + 1)));
}));
test('Getting reading with empty queue gets averaged reading.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let expectedAverage = 0;
    mockSensors.forEach((x, i) => {
        x.setup(s => s.getReadingAsync()).returns(() => {
            return new Promise(res => res(i));
        });
        expectedAverage += i;
    });
    expectedAverage = expectedAverage / mockSensors.length;
    expect(yield meanSensorFilter.getReadingAsync()).toBe(expectedAverage);
}));
test('Disposing mean filter disposes underlying sensors', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    meanSensorFilter.dispose();
    mockSensors.forEach(s => s.verify(x => x.dispose(), typemoq_1.Times.once()));
}));
//# sourceMappingURL=MeanSensorFilter.test.js.map
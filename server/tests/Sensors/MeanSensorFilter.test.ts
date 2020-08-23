import MeanSensorFilter, { ISensor } from '../../src/Sensors/MeanSensorFilter';
import {IMock, Mock, Times} from 'typemoq'

let meanSensorFilter: ISensor;

let dummyAverageQueueSize: number = 5;
let mockSensors: IMock<ISensor>[];

beforeEach(() => {
    mockSensors = [Mock.ofType<ISensor>(), Mock.ofType<ISensor>()];
    meanSensorFilter = new MeanSensorFilter(dummyAverageQueueSize, mockSensors.map(x => x.object));
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Getting reading gets reading from all underlying sensors.', async () => {
    await meanSensorFilter.getReadingAsync();

    mockSensors.forEach(mockSensor =>
        mockSensor.verify(s => s.getReadingAsync(),
        Times.exactly(dummyAverageQueueSize + 1)
    ));
});

test('Getting reading with empty queue gets averaged reading.', async () => {
    var expectedAverage = 0;

    mockSensors.forEach((x: IMock<ISensor>, i: number) => {
        x.setup(s => s.getReadingAsync()).returns(() => { 
            return new Promise(res => res(i))
        });
        expectedAverage += i;
    });

    expectedAverage = expectedAverage/mockSensors.length;

    expect(await meanSensorFilter.getReadingAsync()).toBe(expectedAverage);
});

test('Disposing mean filter disposes underlying sensors', async () => {
    meanSensorFilter.dispose();

    mockSensors.forEach(s => s.verify(x => x.dispose(), Times.once()));
});
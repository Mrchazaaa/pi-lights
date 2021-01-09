import MeanSensorDecorator, { ISensor } from '../../src/Sensors/MeanSensorDecorator';
import {IMock, Mock, Times} from 'typemoq'

const dummyAverageQueueSize: number = 5;
let mockSensor: IMock<ISensor<number>>;

let meanSensorDecorator: ISensor<number>;

    describe('Tests for MeanSensorDecorator.', () => {
    beforeEach(() => {
        mockSensor = Mock.ofType<ISensor<number>>();
        meanSensorDecorator = new MeanSensorDecorator(dummyAverageQueueSize, mockSensor.object);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Getting reading gets reading from underlying sensor.', async () => {
        await meanSensorDecorator.getReadingAsync();

        mockSensor.verify(s => s.getReadingAsync(), Times.exactly(dummyAverageQueueSize));
    });

    test('Getting reading with empty queue, gets averaged reading.', async () => {
        const dummyReading = 3;

        mockSensor.setup(s => s.getReadingAsync()).returns(() => Promise.resolve(dummyReading));

        expect(await meanSensorDecorator.getReadingAsync()).toBe(dummyReading);
    });

    test('Getting reading with non-empty queue, gets averaged reading.', async () => {
        const dummyReading = 3;

        mockSensor.setup(s => s.getReadingAsync()).returns(() => Promise.resolve(dummyReading));

        expect(await meanSensorDecorator.getReadingAsync()).toBe(dummyReading);

        const newDummyReading = 5;

        mockSensor.setup(s => s.getReadingAsync()).returns(() => Promise.resolve(newDummyReading));

        const expectedNewMean = ((dummyReading * (dummyAverageQueueSize - 1)) + newDummyReading)/dummyAverageQueueSize;

        expect(await meanSensorDecorator.getReadingAsync()).toBe(expectedNewMean);
    });

    test('Disposing mean filter disposes underlying sensor.', async () => {
        meanSensorDecorator.dispose();

        mockSensor.verify(x => x.dispose(), Times.once());
    });
});
import getMockInstances from '../TestUtilities';
import SensorReadRateLimitDecorator, { ISensor } from '../../src/Sensors/SensorReadRateLimitDecorator';
import RateLimitedOperation from '../../src/Utilities/RateLimitedOperation';
import {IMock, Mock, Times} from 'typemoq'

jest.mock('../../src/Utilities/RateLimitedOperation');

let sensorReadRateLimitDecorator: ISensor<number>;
let mockSensor: IMock<ISensor<number>>;
const dummyRateLimit = 500;

describe('Tests for SensorReadRateLimitDecorator.', () => {
    beforeEach(() => {
        mockSensor = Mock.ofType<ISensor<number>>();
        sensorReadRateLimitDecorator = new SensorReadRateLimitDecorator(mockSensor.object, dummyRateLimit);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Creating a new light creates an underlying rate limited operation, for the given sensors read method.', () => {
        expect(RateLimitedOperation).toBeCalledTimes(1);
        expect(RateLimitedOperation).toHaveBeenLastCalledWith(expect.any(Function), dummyRateLimit);
    });

    test('Getting reading gets reading from rate limited operation.', async () => {
        await sensorReadRateLimitDecorator.getReadingAsync();

        const mockedRateLimitedOperation = getMockInstances(RateLimitedOperation as jest.Mock<RateLimitedOperation<number>>)[0];

        expect(mockedRateLimitedOperation.execute).toBeCalledTimes(1);
    });

    test('Disposing disposes underlying sensor.', async () => {
        sensorReadRateLimitDecorator.dispose();

        mockSensor.verify(x => x.dispose(), Times.once());
    });
});

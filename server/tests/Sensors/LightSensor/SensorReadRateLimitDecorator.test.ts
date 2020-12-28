import SensorReadRateLimitDecorator, { ISensor } from '../../../src/Sensors/SensorReadRateLimitDecorator';
import {IMock, Mock, Times} from 'typemoq'
import { sleep } from '../../../src/TimingHelper';

let sensorReadRateLimitDecorator: ISensor<number>;

let mockSensor: IMock<ISensor<number>>;

beforeEach(() => {
    mockSensor = Mock.ofType<ISensor<number>>();

    sensorReadRateLimitDecorator = new SensorReadRateLimitDecorator(500, mockSensor.object);
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Getting reading gets reading from underlying sensor.', async () => {
    await sensorReadRateLimitDecorator.getReadingAsync();

    mockSensor.verify(s => s.getReadingAsync(), Times.once());
});

test('Getting subsequent reading, before timeout is reached, returns the same reading promise.', async () => {
    let dummyFirstPromiseResolver;
    let dummySecondPromiseResolver;

    mockSensor.setup(s => s.getReadingAsync())
        .returns(() => {
            return new Promise(res => {
                dummyFirstPromiseResolver = res
            })
        });

    const firstPromise = sensorReadRateLimitDecorator.getReadingAsync();

    mockSensor.setup(s => s.getReadingAsync())
        .returns(() => {
            return new Promise(res => {
                dummySecondPromiseResolver = res
            })
        });

    const secondPromise = sensorReadRateLimitDecorator.getReadingAsync();

    mockSensor.verify(s => s.getReadingAsync(), Times.once());

    expect(firstPromise === secondPromise);

    expect(dummySecondPromiseResolver).toBe(undefined);
    dummyFirstPromiseResolver(1);

    expect(await firstPromise).toBe(1);
    expect(await secondPromise).toEqual(1);
});

test('Getting subsequent reading, after timeout is reached, returns new reading promise.', async () => {

    const readRateLimit = 10;
    sensorReadRateLimitDecorator = new SensorReadRateLimitDecorator(readRateLimit, mockSensor.object);

    let dummyFirstPromiseResolver;
    let dummySecondPromiseResolver;

    mockSensor.setup(s => s.getReadingAsync())
        .returns(() => {
            return new Promise(res => {
                dummyFirstPromiseResolver = res
            })
        });

    const firstPromise = sensorReadRateLimitDecorator.getReadingAsync();

    await sleep(readRateLimit * 2);

    mockSensor.setup(s => s.getReadingAsync())
        .returns(() => {
            return new Promise(res => {
                dummySecondPromiseResolver = res
            })
        });

    const secondPromise = sensorReadRateLimitDecorator.getReadingAsync();

    mockSensor.verify(s => s.getReadingAsync(), Times.exactly(2));

    expect(firstPromise !== secondPromise);

    dummyFirstPromiseResolver(1);
    dummySecondPromiseResolver(2);

    expect(await firstPromise).toBe(1);
    expect(await secondPromise).toEqual(2);
});

test('Disposing disposes underlying sensors', async () => {
    sensorReadRateLimitDecorator.dispose();

    mockSensor.verify(x => x.dispose(), Times.once());
});

import LightSensor, { ISensor } from '../../../src/Sensors/LightSensor/LightSensor';
import TSL2561 from '../../../src/Sensors/LightSensor/TSL2561';
import { IMock, Mock, Times, It } from 'typemoq'

var lightSensor: LightSensor;
var mockedInternalSensor: IMock<TSL2561>;

describe('Tests for LightSensor.', () => {
    beforeEach(() => {
        mockedInternalSensor = Mock.ofType<TSL2561>();
        lightSensor = new LightSensor(mockedInternalSensor.object);
    });

    test('Getting reading, reads ambient light level from internal sensor.', async () => {
        const dummyAmbientReading = 500;

        const dummyReading = {
            IR: 100,
            ambient: dummyAmbientReading
        };

        mockedInternalSensor.setup(m => m.getReadingAsync()).returns(() => Promise.resolve(dummyReading));

        const result = await lightSensor.getReadingAsync();

        expect(result).toEqual(dummyAmbientReading);
        mockedInternalSensor.verify(m => m.getReadingAsync(), Times.once());
    });

    test('Disposing disposes internal sensor.', async () => {
        lightSensor.dispose();
        mockedInternalSensor.verify(m => m.dispose(), Times.once());
    });
});
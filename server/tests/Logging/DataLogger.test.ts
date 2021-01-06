import DataLogger from '../../src/Logging/DataLogger';
import jsonfile from 'jsonfile';
import fs from 'fs';

jest.mock('fs');
jest.mock('jsonfile');

var dataLogger: DataLogger;
const baseFilePath: string = "dummy/filePath";
const dummyDatum: number = 420;

describe('Tests for DataLogger.', () => {
    beforeEach(() => {
        dataLogger = new DataLogger(baseFilePath);
    });

    test('Logging datum to non-existent file, creates file and logs to it.', () => {
        fs.existsSync = jest.fn().mockReturnValueOnce(true);
        jsonfile.writeFileSync = jest.fn();

        dataLogger.log(dummyDatum);

        expect(jsonfile.writeFileSync).toBeCalledTimes(1);
    });

    // test('Logging datum to existent file, logs to it.', async () => {
    //     const message = "my message";

    //     dataLogger.error(message);

    //     mockedInternalLogger.verify(m => m.error(It.is(m => m.includes(dummyContext) && m.includes(message)), It.isAny()), Times.once());
    // });

    // test('Logging datum appends datum to existing file indexed under the current date.', async () => {
    //     const message = "my message";

    //     dataLogger.info(message);

    //     mockedInternalLogger.verify(m => m.info(It.is(m => m.includes(dummyContext) && m.includes(message)), It.isAny()), Times.once());
    // });
});
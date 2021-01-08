import DataLogger from '../../src/Logging/DataLogger';
import FileUtilities from '../../src/FileUtilities/FileUtilities';
import MockDate from 'mockdate'

jest.doMock('../../src/FileUtilities/FileUtilities')

let dataLogger: DataLogger;
const dummyFilePath: string = 'dummy/filePath';
const dummyDatum: number = 420;
const dummyDate: number = 1000000000000;

describe('Tests for DataLogger.', () => {
    beforeEach(() => {
        dataLogger = new DataLogger(dummyFilePath);
        MockDate.set(dummyDate);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Logging datum to non-existent file, creates file and logs to it.', async () => {
        (FileUtilities.writeJsonToFile as jest.Mock) = jest.fn();
        (FileUtilities.fileExistsForWriting as jest.Mock) = jest.fn().mockResolvedValueOnce(false);

        await dataLogger.log(dummyDatum);

        const expectedObject = {};
        expectedObject[dummyDate] = dummyDatum;

        expect(FileUtilities.writeJsonToFile).toBeCalledTimes(1);
        expect(FileUtilities.writeJsonToFile).toBeCalledWith(expect.stringContaining(dummyFilePath), expectedObject);
        expect(FileUtilities.fileExistsForWriting).toBeCalledTimes(1);
    });

    test('Logging datum to existent file, reads the file and appends to its existing data.', async () => {
        const dummyExistingData = {'1000000000000': 560};

        (FileUtilities.writeJsonToFile as jest.Mock) = jest.fn();
        (FileUtilities.readJsonFile as jest.Mock) = jest.fn().mockResolvedValue({});
        (FileUtilities.fileExistsForWriting as jest.Mock) = jest.fn().mockResolvedValueOnce(true);

        await dataLogger.log(dummyDatum);

        const expectedObject = dummyExistingData;
        expectedObject[dummyDate] = dummyDatum;

        expect(FileUtilities.writeJsonToFile).toBeCalledTimes(1);
        expect(FileUtilities.writeJsonToFile).toBeCalledWith(expect.stringContaining(dummyFilePath), expectedObject);
        expect(FileUtilities.readJsonFile).toBeCalledTimes(1);
        expect(FileUtilities.fileExistsForWriting).toBeCalledTimes(1);
    });
});
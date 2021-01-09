import FileUtilities from '../../src/FileUtilities/FileUtilities';
import fs from 'fs';
const fsPromises = fs.promises

describe('Tests for FileUtilities.', () => {
    beforeEach(() => {
        fs.readdirSync = jest.fn();
        fsPromises.readFile = jest.fn();
        fsPromises.writeFile = jest.fn();
        fsPromises.access = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();

        (fs.readdirSync as jest.Mock).mockRestore();
        (fsPromises.readFile as jest.Mock).mockRestore();
        (fsPromises.writeFile as jest.Mock).mockRestore();
        (fsPromises.access as jest.Mock).mockRestore();
    });

    test('Listing directory contents lists contents of directories.', () => {
        const dummyFileSystem: { [folder: string] : string[]; } = {
            'folder1': ['file1', 'file2', 'file3'],
            'folder2': ['file1', 'file5', 'file3'],
            'folder3': ['file1', 'file2', 'file3'],
        };

        (fs.readdirSync as jest.Mock).mockImplementation( (path: string) => {
            return dummyFileSystem[path];
        });

        const expectedResult = ['file1', 'file2', 'file3', 'file5'];

        const result = FileUtilities.listDirectoryContents(['folder1', 'folder2', 'folder3']);

        expect(fs.readdirSync).toBeCalledTimes(3);
        expect(result).toEqual(expectedResult);
    });

    test('Listing directory contents removes .json suffixes.', () => {
        (fs.readdirSync as jest.Mock).mockReturnValue(['fileName1.json', 'fileName2.json', 'fileName3', 'fileName4.json']);

        const result = FileUtilities.listDirectoryContents(['dummyPath']);

        expect(fs.readdirSync).toBeCalledTimes(1);
        expect(result).toEqual(['fileName1', 'fileName2', 'fileName3', 'fileName4']);
    });

    test('Listing directory contents removes .log suffixes.', () => {
        (fs.readdirSync as jest.Mock).mockReturnValue(['fileName1.log', 'fileName2.log', 'fileName3', 'fileName4.log']);

        const result = FileUtilities.listDirectoryContents(['dummyPath']);

        expect(fs.readdirSync).toBeCalledTimes(1);
        expect(result).toEqual(['fileName1', 'fileName2', 'fileName3', 'fileName4']);
    });

    test('Listing directory contents for fake folder returns empty list.', () => {
        (fs.readdirSync as jest.Mock).mockImplementation(() => { throw new Error('No such file.')});

        FileUtilities.listDirectoryContents(['dummyPath']);

        expect(fs.readdirSync).toThrowError();
    });

    test('Reading json file reads json file.', async () => {
        const dummyFileData = {dummy: '420'};
        const dummyFilePath = './myFile.json';

        (fsPromises.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(dummyFileData));

        const result = await FileUtilities.readJsonFile(dummyFilePath);

        expect(result).toEqual(dummyFileData);
        expect(fsPromises.readFile).toBeCalledTimes(1);
        expect(fsPromises.readFile).toBeCalledWith(dummyFilePath, 'utf-8');
    });

    test('Writing json file writes json file.', async () => {
        const dummyFileData = {dummy: '420'};
        const dummyFilePath = './myFile.json';

        await FileUtilities.writeJsonToFile(dummyFilePath, dummyFileData);

        expect(fsPromises.writeFile).toBeCalledTimes(1);
        expect(fsPromises.writeFile).toBeCalledWith(dummyFilePath, JSON.stringify(dummyFileData), 'utf-8');
    });

    test('Checking file exists for writing, returns false if file is not available for writing.', async () => {
        const dummyFilePath = './myFile.json';

        (fsPromises.access as jest.Mock).mockImplementationOnce(() => { throw new Error() });

        const result = await FileUtilities.fileExistsForWriting(dummyFilePath);

        expect(result).toEqual(false);
        expect(fsPromises.access).toBeCalledTimes(1);
        expect(fsPromises.access).toBeCalledWith(dummyFilePath, fs.constants.W_OK);
    });

    test('Checking file exists for writing, returns true if file is available for writing.', async () => {
        const dummyFilePath = './myFile.json';

        const result = await FileUtilities.fileExistsForWriting(dummyFilePath);

        expect(result).toEqual(true);
        expect(fsPromises.access).toBeCalledTimes(1);
        expect(fsPromises.access).toBeCalledWith(dummyFilePath, fs.constants.W_OK);
    });
});
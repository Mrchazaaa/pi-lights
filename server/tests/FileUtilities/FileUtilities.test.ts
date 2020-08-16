import FileUtilities from '../../src/FileUtilities/FileUtilities';
import fs from 'fs';

var fileUtilities;

jest.mock('fs');

beforeEach(() => {
    fileUtilities = new FileUtilities();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('listing directory contents lists contents of directories', () => {
    var testDockStructure: { [folder: string] : string[]; } = {
        "folder1": ["file1", "file2", "file3"],
        "folder2": ["file1", "file5", "file3"],
        "folder3": ["file1", "file2", "file3"],
    };

    (fs.readdirSync as jest.Mock).mockImplementation( (path: string) => {
        return testDockStructure[path.toString()];
    });

    var expectedResult = ["file1", "file2", "file3", "file5"];

    var result = FileUtilities.listDirectoryContents(['folder1', 'folder2', 'folder3']);

    expect(fs.readdirSync).toBeCalledTimes(3);
    expect(result).toEqual(expectedResult);
});

test('listing directory contents removes .json suffixes', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(["fileName1.json", "fileName2.json", "fileName3", "fileName4.json"]);

    var result = FileUtilities.listDirectoryContents(['dummyPath']);

    expect(fs.readdirSync).toBeCalledTimes(1);
    expect(result).toEqual(["fileName1", "fileName2", "fileName3", "fileName4"]);
});

test('listing directory contents removes .log suffixes', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(["fileName1.log", "fileName2.log", "fileName3", "fileName4.log"]);

    var result = FileUtilities.listDirectoryContents(['dummyPath']);

    expect(fs.readdirSync).toBeCalledTimes(1);
    expect(result).toEqual(["fileName1", "fileName2", "fileName3", "fileName4"]);
});

test('listing directory contents for fake folder returns empty list', () => {
    (fs.readdirSync as jest.Mock).mockImplementation(() => { throw new Error("No such file.")});

    var result = FileUtilities.listDirectoryContents(['dummyPath']);

    expect(fs.readdirSync).toThrowError();
});

test('reading json file reads json file', () => {
    const dummyFileData = "I'm file data";
    const dummyFilePath = "./";

    (fs.readFileSync as jest.Mock).mockImplementation(() => JSON.stringify(dummyFileData));

    var result = FileUtilities.readJsonFile(dummyFilePath);

    expect(result).toEqual(dummyFileData);
    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(dummyFilePath);
});
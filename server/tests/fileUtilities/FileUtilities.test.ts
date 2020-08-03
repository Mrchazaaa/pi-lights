import FileUtilities from '../../src/fileUtilities/FileUtilities';
import fs from 'fs';

jest.mock('fs');

var mockReadFileSync: jest.Mock;
var mockReaddirSync: jest.Mock;

var fileUtilities;

beforeEach(() => {
    mockReadFileSync = fs.readFileSync as jest.Mock;
    mockReaddirSync = fs.readdirSync as jest.Mock;

    fileUtilities = new FileUtilities();
});

afterEach(() => {
    mockReadFileSync.mockReset();
    mockReaddirSync.mockReset();
});

test('listing directory contents lists contents of directories', () => {
    
    var testDockStructure: { [folder: string] : string[]; } = {
        "folder1": ["file1", "file2", "file3"],
        "folder2": ["file1", "file5", "file3"],
        "folder3": ["file1", "file2", "file3"],
    };

    mockReaddirSync.mockImplementation((folderName: string) => {
        return testDockStructure[folderName];
    });

    var expectedResult = ["file1", "file2", "file3", "file5"];

    var result = FileUtilities.listDirectoryContents(['folder1', 'folder2', 'folder3']);

    expect(mockReaddirSync).toBeCalledTimes(3);
    expect(result).toEqual(expectedResult);
});

// test('listing directory contents removes .json suffixes', () => {
    
//     mockReaddirSync.mockReturnValue(["fileName1"]);

//     var result = FileUtilities.listDirectoryContents(['dummyPath']);

//     expect(mockReaddirSync).toBeCalledTimes(1);
//     expect(result).toEqual(["sdfcvb"]);
// });

// test('listing directory contents removes .log suffixes', () => {
    
//     mockReaddirSync.mockReturnValue(["fileName1"]);

//     var result = FileUtilities.listDirectoryContents(['dummyPath']);

//     expect(mockReaddirSync).toBeCalledTimes(1);
//     expect(result).toEqual(["sdfcvb"]);
// });

// test('listing directory contents for fake folder returns empty list', () => {
    
//     mockReaddirSync.mockReturnValue(["fileName1"]);

//     var result = FileUtilities.listDirectoryContents(['dummyPath']);

//     expect(mockReaddirSync).toBeCalledTimes(1);
//     expect(result).toEqual(["sdfcvb"]);
// });
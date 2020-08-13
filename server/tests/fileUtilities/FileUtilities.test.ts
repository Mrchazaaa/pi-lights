import FileUtilities from '../../src/fileUtilities/FileUtilities';
import fs from 'fs';

var fileUtilities;

jest.mock('fs');

beforeEach(() => {
    fileUtilities = new FileUtilities();
});

test('listing directory contents lists contents of directories', () => {
    
    var testDockStructure: { [folder: string] : string[]; } = {
        "folder1": ["file1", "file2", "file3"],
        "folder2": ["file1", "file5", "file3"],
        "folder3": ["file1", "file2", "file3"],
    };

    // mockFS.readdirSync.mockImplementation((folderName: fs.PathLike) => {
    (fs.readdirSync as jest.Mock).mockImplementation( (path: string) => {
        return testDockStructure[path.toString()];
    });

    var expectedResult = ["file1", "file2", "file3", "file5"];

    var result = FileUtilities.listDirectoryContents(['folder1', 'folder2', 'folder3']);

    expect(fs.readdirSync).toBeCalledTimes(3);
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
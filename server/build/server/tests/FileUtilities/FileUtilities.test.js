"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const FileUtilities_1 = tslib_1.__importDefault(require("../../src/FileUtilities/FileUtilities"));
const fs_1 = tslib_1.__importDefault(require("fs"));
let fileUtilities;
jest.mock('fs');
beforeEach(() => {
    fileUtilities = new FileUtilities_1.default();
});
afterEach(() => {
    jest.resetAllMocks();
});
test('listing directory contents lists contents of directories', () => {
    const testDockStructure = {
        'folder1': ['file1', 'file2', 'file3'],
        'folder2': ['file1', 'file5', 'file3'],
        'folder3': ['file1', 'file2', 'file3'],
    };
    fs_1.default.readdirSync.mockImplementation((path) => {
        return testDockStructure[path.toString()];
    });
    const expectedResult = ['file1', 'file2', 'file3', 'file5'];
    const result = FileUtilities_1.default.listDirectoryContents(['folder1', 'folder2', 'folder3']);
    expect(fs_1.default.readdirSync).toBeCalledTimes(3);
    expect(result).toEqual(expectedResult);
});
test('listing directory contents removes .json suffixes', () => {
    fs_1.default.readdirSync.mockReturnValue(['fileName1.json', 'fileName2.json', 'fileName3', 'fileName4.json']);
    const result = FileUtilities_1.default.listDirectoryContents(['dummyPath']);
    expect(fs_1.default.readdirSync).toBeCalledTimes(1);
    expect(result).toEqual(['fileName1', 'fileName2', 'fileName3', 'fileName4']);
});
test('listing directory contents removes .log suffixes', () => {
    fs_1.default.readdirSync.mockReturnValue(['fileName1.log', 'fileName2.log', 'fileName3', 'fileName4.log']);
    const result = FileUtilities_1.default.listDirectoryContents(['dummyPath']);
    expect(fs_1.default.readdirSync).toBeCalledTimes(1);
    expect(result).toEqual(['fileName1', 'fileName2', 'fileName3', 'fileName4']);
});
test('listing directory contents for fake folder returns empty list', () => {
    fs_1.default.readdirSync.mockImplementation(() => { throw new Error('No such file.'); });
    const result = FileUtilities_1.default.listDirectoryContents(['dummyPath']);
    expect(fs_1.default.readdirSync).toThrowError();
});
test('reading json file reads json file', () => {
    const dummyFileData = 'I\'m file data';
    const dummyFilePath = './';
    fs_1.default.readFileSync.mockImplementation(() => JSON.stringify(dummyFileData));
    const result = FileUtilities_1.default.readJsonFile(dummyFilePath);
    expect(result).toEqual(dummyFileData);
    expect(fs_1.default.readFileSync).toBeCalledTimes(1);
    expect(fs_1.default.readFileSync).toBeCalledWith(dummyFilePath);
});
//# sourceMappingURL=FileUtilities.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
class FileUtilities {
    static listDirectoryContents(directories) {
        let fileNames = [];
        try {
            fileNames = fileNames.concat.apply([], directories.map(directoryPath => fs_1.default.readdirSync(directoryPath)));
        }
        catch (e) {
            fileNames = [];
        }
        fileNames = fileNames.map((fileName) => fileName.replace(/\.json|\.log/gi, ''));
        return fileNames.filter((elem, pos) => {
            return fileNames.indexOf(elem) === pos;
        });
    }
    static readJsonFile(graphDataFilePath) {
        return JSON.parse(fs_1.default.readFileSync(graphDataFilePath).toString());
    }
}
exports.default = FileUtilities;
//# sourceMappingURL=FileUtilities.js.map
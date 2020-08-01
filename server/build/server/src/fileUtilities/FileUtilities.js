"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
class FileUtilities {
    static listDirectoryContents(directories) {
        let fileNames = [];
        fileNames = fileNames.concat.apply([], directories.map(directoryPath => fs.readdirSync(directoryPath)));
        fileNames = fileNames.map((fileName) => fileName.replace(/\.json|\.log/gi, ''));
        return fileNames.filter((elem, pos) => {
            return fileNames.indexOf(elem) === pos;
        });
    }
    static readJsonFile(graphDataFilePath) {
        return JSON.parse(fs.readFileSync(graphDataFilePath).toString());
    }
}
exports.default = FileUtilities;
//# sourceMappingURL=FileUtilities.js.map
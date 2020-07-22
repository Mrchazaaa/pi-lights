import fs from 'fs';

export default class FileUtilities {
    public static listDirectoryContents(directories: string[]): string[] {
        var fileNames = [].concat.apply([], directories.map(directoryPath => fs.readdirSync(directoryPath)));
        
        fileNames = fileNames.map((fileName: string) => fileName.replace(/\.json|\.log/gi, ""));

        return fileNames.filter(function(elem: string, pos: Number) {
            return fileNames.indexOf(elem) == pos;
        });
    }
    
    public static readJsonFile(graphDataFilePath: string) {
        return JSON.parse(fs.readFileSync(graphDataFilePath).toString());
    }
}
import fs from 'fs';
import jsonfile from 'jsonfile';

export default class FileUtilities {
    public static listDirectoryContents(directories: string[]): string[] {
        let fileNames: string[] = [];

        try {
            fileNames = fileNames.concat.apply(
                [], directories.map(directoryPath => fs.readdirSync(directoryPath)));

        }
        catch (e) {
            fileNames = [];
        }

        fileNames = fileNames.map((fileName: string) => fileName.replace(/\.json|\.log/gi, ''));

        return fileNames.filter((elem: string, pos: number) => {
            return fileNames.indexOf(elem) === pos;
        });
    }

    public static readJsonFile(graphDataFilePath: string) {
        return JSON.parse(fs.readFileSync(graphDataFilePath).toString());
    }

    private static logDatum(datum: number, baseFilePath: string): void {
        const filepath = `${baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

        let data: any = {};

        if (fs.existsSync(filepath)) {
            data =jsonfile.readFileSync(filepath);
        }

        data[Date.now()] = datum;

        jsonfile.writeFileSync(filepath, data);
    }
}
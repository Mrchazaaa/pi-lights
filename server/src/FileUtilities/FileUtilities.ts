import fs from 'fs';
const fsPromises = fs.promises

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

    public static async readJsonFile(filepath: string): Promise<object> {
        const rawData = await fsPromises.readFile(filepath, 'utf8');
        return JSON.parse(rawData);
    }

    // public static async writeJsonToFile(filepath: string, data: any): Promise<void> {
    public static async writeJsonToFile(filepath: string, data: any): Promise<void> {
        const stringifiedData = JSON.stringify(data);
        return await fsPromises.writeFile(filepath, stringifiedData, 'utf8');
    }

    public static async fileExistsForWriting(filepath: string): Promise<boolean> {
        try {
            await fsPromises.access(filepath, fs.constants.W_OK);
            return true;
        } catch(e) {
            return false;
        }
    }
}
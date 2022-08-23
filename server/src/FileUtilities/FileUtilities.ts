import fs from 'fs';
const fsPromises = fs.promises
import AsyncLock from 'async-lock';
const lock = new AsyncLock();
import path from 'path';

export default class FileUtilities {
    private static async exists(path) {
        try {
            await fsPromises.access(path);
            return true;
        } catch {
            return false;
        }
    }

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
        const rawData = await lock.acquire(filepath, async () => {
            return await fsPromises.readFile(filepath, 'utf-8');
        });
        return JSON.parse(rawData);
    }

    public static async deleteFile(filepath: string): Promise<void> {
        await lock.acquire(filepath, async () =>
            await fsPromises.unlink(filepath)
        );
    }

    public static async writeJsonToFile(filepath: string, data: any): Promise<void> {
        const dirname = path.dirname(filepath);
        const exist = await FileUtilities.exists(dirname);

        if (!exist) {
            fs.mkdirSync(dirname, { recursive: true });
        }

        const stringifiedData = JSON.stringify(data);

        return await lock.acquire(filepath, async () => {
            return await fsPromises.writeFile(filepath, stringifiedData, 'utf-8');
        });
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
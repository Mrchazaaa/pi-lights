import FileUtilities from '../FileUtilities/FileUtilities';
import IDataLogger from './IDataLogger';

export default class DataLogger implements IDataLogger {

    private baseFilePath: string;

    constructor(baseFilePath: string) {
        this.baseFilePath = baseFilePath;
    }

    public async log(datum: number): Promise<void> {
        const filepath = `${this.baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

        let data: any = {};

        if (await FileUtilities.fileExistsForWriting(filepath)) {
            data = await FileUtilities.readJsonFile(filepath);
        }

        data[Date.now()] = datum;

        await FileUtilities.writeJsonToFile(filepath, data);
    }
}

export { IDataLogger };
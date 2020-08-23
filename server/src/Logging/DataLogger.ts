import fs from 'fs';
import jsonfile from 'jsonfile';
import IDataLogger from './IDataLogger';

export default class DataLogger implements IDataLogger {

    private baseFilePath: string;

    constructor(baseFilePath: string) {
        this.baseFilePath = baseFilePath;
    }

    public log(datum: number): void {
        const filepath = `${this.baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

        let data: any = {};

        if (fs.existsSync(filepath)) {
            data =jsonfile.readFileSync(filepath);
        }

        data[Date.now()] = datum;

        jsonfile.writeFileSync(filepath, data);
    }
}

export { IDataLogger };
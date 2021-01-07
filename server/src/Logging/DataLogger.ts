import fs from 'fs';
const fsPromises = fs.promises
// import jsonfile from 'jsonfile';
import IDataLogger from './IDataLogger';
import path from 'path'; 


export default class DataLogger implements IDataLogger {

    private baseFilePath: string;

    constructor(baseFilePath: string) {
        this.baseFilePath = baseFilePath;
    }

    public async log(datum: number): Promise<void> {
        const filepath = `${this.baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

        let data: any = {};

        if (fs.existsSync(filepath)) {
        // if (await fsPromises.stat(filepath)) {
            var rawData = fs.readFileSync(filepath, 'utf8');
            // var rawData = await fsPromises.readFile(filepath, 'utf8');
            data = JSON.parse(rawData);
        }

        data[Date.now()] = datum;

        var stringifiedData = JSON.stringify(data);

        fs.writeFileSync(filepath, stringifiedData, 'utf8');
        // await fsPromises.writeFile(filepath, stringifiedData, 'utf8');
    }
}

export { IDataLogger };
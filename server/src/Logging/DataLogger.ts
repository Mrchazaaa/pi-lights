import FileUtilities from '../FileUtilities/FileUtilities';
import IDataLogger from './IDataLogger';
import LoggerProvider, { ILogger } from './LoggerProvider';

export default class DataLogger implements IDataLogger {

	private logger: ILogger;
    private baseFilePath: string;

    constructor(baseFilePath: string) {
		this.logger = LoggerProvider.createLogger(DataLogger.name);
        this.baseFilePath = baseFilePath;
    }

    public async log(datum: number): Promise<void> {
        try {
            const filepath = `${this.baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

            let data: any = {};

            if (await FileUtilities.fileExistsForWriting(filepath)) {
                data = await FileUtilities.readJsonFile(filepath);
            }

            data[Date.now()] = datum;

            await FileUtilities.writeJsonToFile(filepath, data);
        } catch(e) {
            this.logger.error(`Failed to log datum ${datum} due to ${e.toString()}`);
            throw e;
        }
    }
}

export { IDataLogger };
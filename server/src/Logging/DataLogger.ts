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
        this.logger.info(`Logging datum ${datum}.`);

        try {
            const filepath = `${this.baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

            let data: any = {};

            this.logger.info(`Checking existence of file.`);
            if (await FileUtilities.fileExistsForWriting(filepath)) {
                this.logger.info(`File exists.`);
                data = await FileUtilities.readJsonFile(filepath);
            }

            data[Date.now()] = datum;

            this.logger.info(`Writing to file.`);
            await FileUtilities.writeJsonToFile(filepath, data);
        } catch(e) {
            this.logger.error(`Failed to log datum ${datum} due to ${e.toString()}`);
            throw e;
        }
    }
}

export { IDataLogger };
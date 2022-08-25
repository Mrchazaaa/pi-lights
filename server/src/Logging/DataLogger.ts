import { dataBaseFilePath, logsBaseFilePath, clientBuildPath } from '../../../config.json';
import FileUtilities from '../FileUtilities/FileUtilities';
import IDataLogger from './IDataLogger';
import LoggerProvider, { ILogger } from './LoggerProvider';

export default class DataLogger implements IDataLogger {

	private logger: ILogger;
    private baseFilePath: string;
    private maxFiles: number;

    constructor(baseFilePath: string, maxFiles: number) {
		this.logger = LoggerProvider.createLogger(DataLogger.name);
        this.baseFilePath = baseFilePath;
        this.maxFiles = maxFiles;
    }

    public async log(datum: number, threshold: number): Promise<void> {
        this.logger.info(`Logging datum ${datum}.`);

        try {
            const filepath = `${this.baseFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;

            let data: any = {};

            this.logger.info(`Checking existence of file.`);
            if (await FileUtilities.fileExistsForWriting(filepath)) {
                this.logger.info(`File exists.`);
                data = await FileUtilities.readJsonFile(filepath);
            } else {
                this.logger.info(`Checking for old data files to delete after deciding to create new data file.`);

                const today = new Date();
                const logCutOffDate = new Date(today);
                const dataFiles = FileUtilities.listDirectoryContents([dataBaseFilePath]);

                const oldFiles = dataFiles.filter(x => Date.parse(x) < logCutOffDate.setDate(logCutOffDate.getDate() - this.maxFiles));

                await oldFiles.forEach(async x => {
                    this.logger.info(`Deleting ${x}.json`);
                    await FileUtilities.deleteFile(`${dataBaseFilePath}/${x}.json`);
                });
            }

            data[Date.now()] = {light: datum, threshold};

            this.logger.info(`Writing to file.`);
            await FileUtilities.writeJsonToFile(filepath, data);
        } catch(e) {
            this.logger.error(`Failed to log datum ${{datum, threshold}} due to ${e.toString()}`);
            throw e;
        }
    }
}

export { IDataLogger };
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

    public async logLux(datum: number, threshold: number): Promise<void> {
        this.logger.info(`Logging lux datum ${datum}.`);

        try {
	    const filename = new Date().toISOString().replace(/T.*/, '');
            const filepath = `${this.baseFilePath}/${filename}.json`;

            let data: any = {'lux': {}, 'threshold': {}, 'lights': {}};

            this.logger.info(`Lux logging - checking existence of file.`);
            if (await FileUtilities.fileExistsForWriting(filepath)) {
                this.logger.info(`Lux logging - file exists.`);
                try {
                    data = await FileUtilities.readJsonFile(filepath);
                } catch (e) {
                    this.logger.error(`Failed read from file ${e.toString()}. Clearing data.`);
                    data = {'lux': {}, 'threshold': {}, 'lights': {}};
                }
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
                    await FileUtilities.deleteFile(`${x}.json`);
                });
            }

            if (Object.keys(data.lux).length === 0)
            {
                data.lux[Date.now()] = datum;
            }
            else {
                const lastLuxValue = data.lux[Math.max(...Object.keys(data.lux).map(x => +x))];

                const minValue = Math.min(datum, lastLuxValue);
                const maxValue = Math.min(datum, lastLuxValue);

                if (Math.abs(datum - lastLuxValue) > 0.25 || (minValue < threshold && threshold < maxValue)) {
                    data.lux[Date.now()] = datum;
                }
            }

	    this.logger.info(`Lux logging - writing to ${filename}.`);
            await FileUtilities.writeJsonToFile(filepath, data);
	    this.logger.info(`Lux logging - finished writing to ${filename}.`);
        } catch(e) {
            this.logger.error(`Failed to log datum ${datum} due to ${e.toString()}`);
            throw e;
        }
    }

    public async logThreshold(datum: number): Promise<void> {
        this.logger.info(`Logging threshold datum ${datum}.`);

        try {
	    const filename = new Date().toISOString().replace(/T.*/, '');
            const filepath = `${this.baseFilePath}/${filename}.json`;

            let data: any = {'lux': {}, 'threshold': {}, 'lights': {}};

            this.logger.info(`Threshold logging - checking existence of file.`);
            if (await FileUtilities.fileExistsForWriting(filepath)) {
                this.logger.info(`Threshold logging - file exists.`);
		try {
			data = await FileUtilities.readJsonFile(filepath);
		} catch (e) {
		    this.logger.error(`Failed read from file ${e.toString()}. Clearing data.`);
		    data = {'lux': {}, 'threshold': {}, 'lights': {}};
		}
            }

            if (Object.keys(data.threshold).length === 0) {
                data.threshold[Date.now()] = datum;
            } else {
                const lastThresholdTime = Math.max(...Object.keys(data.threshold).map(x => +x));

                if (datum !== data.threshold[lastThresholdTime]) {
                    data.threshold[Date.now()] = datum;
                }
            }

	    this.logger.info(`Threshold logging - writing to ${filename}.`);
            await FileUtilities.writeJsonToFile(filepath, data);
	    this.logger.info(`Threshold logging - finished writing to ${filename}.`);
        } catch(e) {
            this.logger.error(`Failed to log datum ${datum} due to ${e.toString()}`);
            throw e;
        }
    }

    public async logLightState(datum: { name: string, state: number }[] ): Promise<void> {
        this.logger.info(`Logging light state datum ${datum}.`);

        try {
	    const filename = new Date().toISOString().replace(/T.*/, '');
            const filepath = `${this.baseFilePath}/${filename}.json`;

            let data: any = {'lux': {}, 'threshold': {}, 'lights': {}};

            this.logger.info(`Light state logging - checking existence of file.`);
            if (await FileUtilities.fileExistsForWriting(filepath)) {
                this.logger.info(`Light state logging - file exists.`);
		try {
			data = await FileUtilities.readJsonFile(filepath);
		} catch (e) {
		    this.logger.error(`Failed read from file ${e.toString()}. Clearing data.`);
		    data = {'lux': {}, 'threshold': {}, 'lights': {}};
		}
            }

            datum.forEach(x => {
                if (!(x.name in data.lights)) {
                    const newValue = {};
                    newValue[Date.now()] = x.state;
                    data.lights[x.name] = newValue;
                } else {
                    const lastLightState = Math.max(...Object.keys(data.lights[x.name]).map(x => +x));

                    if (x.state !== data.lights[x.name][lastLightState]) {
                        data.lights[x.name][Date.now()] = x.state;
                    }
                }
            });

	    this.logger.info(`Light state logging - writing to ${filename}.`);
            await FileUtilities.writeJsonToFile(filepath, data);
	    this.logger.info(`Light state logging - finished writing to ${filename}.`);
        } catch(e) {
            this.logger.error(`Failed to log datum ${datum} due to ${e.toString()}`);
            throw e;
        }
    }
}

export { IDataLogger };

import express, { Express } from 'express';
import FileUtiliies from './FileUtilities/FileUtilities';
import { dataBaseFilePath, logsBaseFilePath, clientBuildPath } from '../../config.json';
import LoggerProvider, { ILogger } from './Logging/LoggerProvider';

export default class WebServer {
	private logger: ILogger;
	private app?: Express;

	constructor() {
        this.logger = LoggerProvider.createLogger(WebServer.name);
    }

    public startWebServer() {
        this.app = express();

        // Serve static files from the client React app
        this.app.use(express.static(clientBuildPath));

        this.app.get('/api/data/:fileName', (req, res) => {
            const dataFileName = req.params.fileName;
            this.logger.info(`Recieved request for data '${dataFileName}'.`);
            res.json(FileUtiliies.readJsonFile(`${dataBaseFilePath}/${dataFileName}.json`));
            this.logger.info('Sent graph data.');
        });

        this.app.get('/api/logs/:fileName', (req,res) => {
            const logsFileName = req.params.fileName;
            this.logger.info(`Recieved request for logs '${logsFileName}'.`);
            res.json(FileUtiliies.readJsonFile(`${logsBaseFilePath}/${logsFileName}.log`));
            this.logger.info('Sent log data.');
        });

        this.app.get('/api/listdata', (req,res) => {
            res.json(FileUtiliies.listDirectoryContents([dataBaseFilePath, logsBaseFilePath]));
            this.logger.info('Sent list of data files.');
        });

        this.app.get('*', (req,res) =>{
            res.sendFile(`${clientBuildPath}/index.html`);
        });

        const port = process.env.PORT || 5000;
        this.app.listen(port);

        this.logger.info(`App is listening on port ${port}.`);
    }
}
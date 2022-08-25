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

        this.app.get('/api/data/:fileName', async (req, res) => {
            try {
                const dataFileName = req.params.fileName;
                this.logger.info(`Recieved request for data '${dataFileName}'.`);
                res.json(await FileUtiliies.readJsonFile(`${dataBaseFilePath}/${dataFileName}.json`));
                this.logger.info('Sent graph data.');
            }
            catch(err) {
                this.logger.error(err);
                res.status(500).send('Something broke :(')
            }
        });

        this.app.get('/api/logs/:fileName', async (req,res) => {
            try {
                const logsFileName = req.params.fileName;
                this.logger.info(`Recieved request for logs '${logsFileName}'.`);
                res.json(await FileUtiliies.readJsonFile(`${logsBaseFilePath}/${logsFileName}.log`));
                this.logger.info('Sent log data.');
            }
            catch(err) {
                this.logger.error(err);
                res.status(500).send('Something broke :(')
            }
        });

        this.app.get('/api/listdata', async (req,res) => {
            try {
                res.json(await FileUtiliies.listDirectoryContents([dataBaseFilePath, logsBaseFilePath]));
                this.logger.info('Sent list of data files.');
            }
            catch(err) {
                this.logger.error(err);
                res.status(500).send('Something broke :(')
            }
        });

        this.app.get('*', (req,res) =>{
            try {
                res.sendFile(`${clientBuildPath}/index.html`);
            }
            catch(err) {
                this.logger.error(err);
                res.status(500).send('Something broke :(')
            }
        });

        const port = process.env.PORT || 5000;
        this.app.listen(port);

        this.logger.info(`App is listening on port ${port}.`);
    }
}
import express from 'express';
import path from 'path';
import LightSensingLightSwitcher from './LightSensingLightSwitcher';
import fileUtiliies from './FileUtilities/FileUtilities';
import * as config from '../../config.js';
import LoggerProvider from './Logging/LoggerProvider';
import ILogger from './Logging/ILogger'
import LightsManager from './Controllers/Lights/LightsManager';
import IMeanSensorFilter from './Sensors/MeanSensorFilter';

const dataBaseFilePath = config.dataBaseFilePath;
const logsBaseFilePath = config.logsBaseFilePath;

const logger: ILogger = LoggerProvider.createLogger('index.ts');

const app = express();

// Serve static files from the client React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/data/:fileName', (req, res) => {
    const dataFileName = req.params.fileName;
    res.json(fileUtiliies.readJsonFile(`${dataBaseFilePath}/${dataFileName}.json`));
    logger.info('Sent graph data.');
});

app.get('/api/logs/:fileName', (req,res) => {
    const logsFileName = req.params.fileName;
    res.json(fileUtiliies.readJsonFile(`${logsBaseFilePath}/${logsFileName}.log`));
    logger.info('Sent log data.');
});

app.get('/api/listdata', (req,res) => {
    res.json(fileUtiliies.listDirectoryContents([dataBaseFilePath, logsBaseFilePath]));
    logger.info('Sent list of data files.');
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
logger.info(`App is listening on port ${port}.`);

new LightSensingLightSwitcher(new LightsManager(), new IMeanSensorFilter()).runControlLoopAsync();
logger.info('Started polling sensors');
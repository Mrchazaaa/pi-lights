import express from 'express';
import path from 'path';
import LightSensingLightSwitcher from './LightSensingLightSwitcher';
import FileUtiliies from './FileUtilities/FileUtilities';
// import * as config from '../../config.json';
import { dataBaseFilePath, logsBaseFilePath, clientBuildPath } from '../../config.json';
import LoggerProvider, { ILogger } from './Logging/LoggerProvider';
import LightsManager from './Controllers/Lights/LightsManager';
import MeanSensorFilter from './Sensors/MeanSensorFilter';
import LightSensor from './Sensors/LightSensor/LightSensor';
import LightFactory from './Controllers/Lights/LightFactory';

// const dataBaseFilePath = config.dataBaseFilePath;
// const logsBaseFilePath = config.logsBaseFilePath;

const logger: ILogger = LoggerProvider.createLogger('index.ts');

const app = express();

// Serve static files from the client React app
app.use(express.static(clientBuildPath));

app.get('/api/data/:fileName', (req, res) => {
    const dataFileName = req.params.fileName;
    logger.info(`Recieved request for data '${dataFileName}'.`);
    res.json(FileUtiliies.readJsonFile(`${dataBaseFilePath}/${dataFileName}.json`));
    logger.info('Sent graph data.');
});

app.get('/api/logs/:fileName', (req,res) => {
    const logsFileName = req.params.fileName;
    logger.info(`Recieved request for logs '${logsFileName}'.`);
    res.json(FileUtiliies.readJsonFile(`${logsBaseFilePath}/${logsFileName}.log`));
    logger.info('Sent log data.');
});

app.get('/api/listdata', (req,res) => {
    res.json(FileUtiliies.listDirectoryContents([dataBaseFilePath, logsBaseFilePath]));
    logger.info('Sent list of data files.');
});

app.get('*', (req,res) =>{
    res.sendFile(`${clientBuildPath}/index.html`);
});

const port = process.env.PORT || 5000;
app.listen(port);
logger.info(`App is listening on port ${port}.`);

const lightSensors = [new LightSensor(4), new LightSensor(17)];

new LightSensingLightSwitcher(new LightsManager(10000, 2, new LightFactory(10000)), new MeanSensorFilter(100, lightSensors), 195).runControlLoopAsync();
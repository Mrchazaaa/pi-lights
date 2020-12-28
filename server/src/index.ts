import express from 'express';
import LightSensingLightSwitcher from './LightSensingLightSwitcher';
import FileUtiliies from './FileUtilities/FileUtilities';
import { dataBaseFilePath, logsBaseFilePath, clientBuildPath } from '../../config.json';
import LoggerProvider, { ILogger } from './Logging/LoggerProvider';
import LightsManager from './Controllers/Lights/LightsManager';
import SensorReadRateLimitWrapper from './Sensors/SensorReadRateLimitDecorator';
import LightFactory from './Controllers/Lights/LightFactory';
import ON_DEATH from 'death';
import ButtonManager from './ButtonManager';
import TSL2561 from './Sensors/LightSensor/TSL2561';

process.title = 'piServer';

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

const lightsManager = new LightsManager(10000, 10000, 2, new LightFactory(10000));

const lightSensingLightSwitcher = new LightSensingLightSwitcher(lightsManager, new SensorReadRateLimitWrapper(500, new TSL2561(2, 16)), 0.3);

// const buttons = new ButtonManager(lightsManager);

ON_DEATH((signal, err) => {
    console.log('Death.')
    logger.info('Death.')

    lightSensingLightSwitcher.dispose();
    // buttons.dispose();
})

process.on('SIGINT', () => {
    console.log('SIGINT');
    lightSensingLightSwitcher.dispose();
    process.exit(2);
});

// catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', (e) => {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    lightSensingLightSwitcher.dispose();
    process.exit(99);
});

lightSensingLightSwitcher.runControlLoopAsync();

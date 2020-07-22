import express from 'express';
import path from 'path';
import lightController from './lightController/';
import fileUtiliies from './fileUtilities/FileUtilities';

import config from '../../config.json';

const dataBaseFilePath = config["dataBaseFilePath"];
const logsBaseFilePath = config["logsBaseFilePath"];

import LoggerFactory from './logging/WinstonLoggerFactory';
import ILogger from './logging/ILogger'

const logger: ILogger = LoggerFactory.createLogger('index.ts');

const app = express();

// Serve static files from the client React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/data/:fileName', (req, res) => {
    var dataFileName = req.params.fileName;
    res.json(fileUtiliies.readJsonFile(`${dataBaseFilePath}/${dataFileName}.json`));
    logger.info('Sent graph data.');
});

app.get('/api/logs/:fileName', (req,res) => {
    var logsFileName = req.params.fileName;
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

lightController.pollSensors(dataBaseFilePath, logger);
logger.info('Started polling sensors');
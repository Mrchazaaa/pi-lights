const config = require("../config.json");

const baseDataFilePath = config["baseDataFilePath"];
const baseLogsFilePath = config["baseLogsFilePath"];

const lightController = require('./light-controller');
const express = require('express');
const path = require('path');
const fileUtiliies = require('./fileUtilities');

const loggerProvider = require('./loggerProvider');
loggerProvider.initialize();

const logger = loggerProvider.getLogger();

const app = express();

function log(message) {
    logger.info(`[Server] ${message}`);
}

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/graph/:graphName', (req,res) => {
    var graphName = req.params.graphName;
    res.json(fileUtiliies.getFile(`${baseDataFilePath}/${graphName}.json`));
    log('Sent graph data.');
});

app.get('/api/logs/:logName', (req,res) => {
    var logName = req.params.logName;
    res.json(fileUtiliies.getFile(`${baseLogsFilePath}/${logName}.log`));
    log('Sent log data.');
});

app.get('/api/listdata', (req,res) => {
    res.json(fileUtiliies.listAvailableData([baseDataFilePath, baseLogsFilePath]));
    log('Sent list of data files.');
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
log(`App is listening on port ${port}.`);

lightController.pollSensors(baseDataFilePath, logger);
log('Started polling sensors');
const config = require("config.json");
const winston = require('winston');

const baseDataFilePath = config["baseLogsFilePath"];

const lightController = require('./light-controller');
const express = require('express');
const path = require('path');
const fileUtiliies = require('./fileUtilities');

require('./light-controller').initialize();

const app = express();

function log(message) {
    logger.info(`[Server] ${message}`);
}

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/graph/:graphName', (req,res) => {
    var graphName = req.params.graphName;
    res.json(fileUtiliies.getGraphData(`${baseDataFilePath}/${graphName}.json`));
    log('Sent graph data.');
});

app.get('/api/listdata', (req,res) => {
    res.json(fileUtiliies.listAvailableData(baseDataFilePath));
    log('Sent list of data files.');
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
log(`App is listening on port ${port}.`);

lightController.pollSensors(baseDataFilePath);
log('Started polling sensors');
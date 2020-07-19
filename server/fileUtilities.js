const fs = require('fs');

function listAvailableData(baseDataFilePath) {
    var files = fs.readdirSync(baseDataFilePath);

    return files.map(fileName => fileName.replace(".json", ""));
}

function getGraphData(graphDataFilePath) {
    return JSON.parse(fs.readFileSync(graphDataFilePath));
}

module.exports = {
    listAvailableData,
    getGraphData
}
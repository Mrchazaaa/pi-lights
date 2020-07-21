const fs = require('fs');

function listAvailableData(directories) {
    var availableFiles = {};
    
    directories.forEach(directoryPath => 
        fs.readdirSync(directoryPath).forEach(availablePath => 
            availableFiles[availablePath.replace(/\.json|\.log/gi, "")] = 1));

    return Object.keys(availableFiles)
}

function getFile(graphDataFilePath) {
    return JSON.parse(fs.readFileSync(graphDataFilePath));
}

module.exports = {
    listAvailableData,
    getFile
}
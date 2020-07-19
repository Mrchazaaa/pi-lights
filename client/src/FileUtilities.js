const fs = require('fs');

function getDirectoryFileNames(baseDataDirectoryPath) {
    return fs.readdirSync(baseDataDirectoryPath, "utf8");
} 
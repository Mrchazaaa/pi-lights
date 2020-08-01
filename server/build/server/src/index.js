"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const LightSensingLightController_1 = tslib_1.__importDefault(require("./lightController/LightSensingLightController"));
const FileUtilities_1 = tslib_1.__importDefault(require("./fileUtilities/FileUtilities"));
const config_json_1 = tslib_1.__importDefault(require("../../config.json"));
const WinstonLoggerFactory_1 = tslib_1.__importDefault(require("./logging/WinstonLoggerFactory"));
const dataBaseFilePath = config_json_1.default.dataBaseFilePath;
const logsBaseFilePath = config_json_1.default.logsBaseFilePath;
const logger = WinstonLoggerFactory_1.default.createLogger('index.ts');
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
app.get('/api/data/:fileName', (req, res) => {
    const dataFileName = req.params.fileName;
    res.json(FileUtilities_1.default.readJsonFile(`${dataBaseFilePath}/${dataFileName}.json`));
    logger.info('Sent graph data.');
});
app.get('/api/logs/:fileName', (req, res) => {
    const logsFileName = req.params.fileName;
    res.json(FileUtilities_1.default.readJsonFile(`${logsBaseFilePath}/${logsFileName}.log`));
    logger.info('Sent log data.');
});
app.get('/api/listdata', (req, res) => {
    res.json(FileUtilities_1.default.listDirectoryContents([dataBaseFilePath, logsBaseFilePath]));
    logger.info('Sent list of data files.');
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/../client/build/index.html'));
});
const port = process.env.PORT || 5000;
app.listen(port);
logger.info(`App is listening on port ${port}.`);
new LightSensingLightController_1.default().run();
logger.info('Started polling sensors');
//# sourceMappingURL=index.js.map
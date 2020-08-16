"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const LightSensingLightSwitcher_1 = tslib_1.__importDefault(require("./LightSensingLightSwitcher"));
const FileUtilities_1 = tslib_1.__importDefault(require("./FileUtilities/FileUtilities"));
const config_json_1 = tslib_1.__importDefault(require("../../config.json"));
const LoggerProvider_1 = tslib_1.__importDefault(require("./Logging/LoggerProvider"));
const LightsManager_1 = tslib_1.__importDefault(require("./Controllers/Lights/LightsManager"));
const AveragingLightSensorsManager_1 = tslib_1.__importDefault(require("./Sensors/LightSensor/AveragingLightSensorsManager"));
const dataBaseFilePath = config_json_1.default.dataBaseFilePath;
const logsBaseFilePath = config_json_1.default.logsBaseFilePath;
const logger = LoggerProvider_1.default.createLogger('index.ts');
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
new LightSensingLightSwitcher_1.default(new LightsManager_1.default(), new AveragingLightSensorsManager_1.default()).runControlLoopAsync();
logger.info('Started polling sensors');
//# sourceMappingURL=index.js.map
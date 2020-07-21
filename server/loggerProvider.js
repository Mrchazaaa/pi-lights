const winston = require('winston');
const config = require("../config.json");
require('winston-daily-rotate-file');

const baseLogsFilePath = config["baseLogsFilePath"];

const rotateTransport = new winston.transports.DailyRotateFile({
    filename: `${baseLogsFilePath}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
});

var loggerProvider = {
    logger: undefined,
    initialize: function() {
        loggerProvider.logger = winston.createLogger({
            level: 'info',
            transports: [
                rotateTransport,
            ],
        });
    
        // logger.add(new winston.transports.Console({
        //     format: winston.format.simple(),
        // }));
    },
    getLogger: function() {
        if (loggerProvider.logger == undefined) {
            throw new Error("Logger is not initialized.");
        }

        return loggerProvider.logger;
    }
};

module.exports = loggerProvider;
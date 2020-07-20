const config = require("config.json");
const { ExceptionHandler } = require("winston");

const baseLogsFilePath = config["baseDataFilePath"];

const rotateTransport = new winston.transports.DailyRotateFile({
    filename: `${baseLogsFilePath}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
});

function initialize() {  
    const logger = winston.createLogger({
        level: 'info',
        transports: [
            rotateTransport,
        ],
    });

    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = {
    initialize
}
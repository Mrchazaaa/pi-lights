var ON_DEATH = require('death');
var Gpio = require('onoff').Gpio;
const fs = require('fs')
const jsonfile = require('jsonfile');

var _logger;

function log(message) {
    _logger.info(`[Sensor] ${message}`);
}

function setLogger(logger) {
    _logger = logger;
}

var dataDirectoryFilePath;

var pins = [
    new Gpio(4, 'out'),
    new Gpio(17, 'out'),
    // new Gpio(27, 'out')
];

var averageQueue = [];

var averageQueueSize = 100;

var threshhold = 195;

function mean(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

function getIndividualSensorReading(sensor) {
    return new Promise(async (resolve, reject) => {
        var count = 0;

        sensor.setDirection('out');
    
        await sensor.write(0);
        
        setTimeout(async sensor => {
            
            sensor.setDirection('in');
            
            // Count until the pin goes high
            while (await sensor.read() == 0) {
                count += 1;
            }

            resolve(count);
        }, 100, sensor);
    });
}

function getAverageSensorReadings() {
    return Promise.all(pins.map(x => getIndividualSensorReading(x)))
        .then(values => {
            return mean(values);
        });
}

function appendNewReading(pastReadings) {
    return new Promise(async (resolve, reject) => {
        readingsMean = await getAverageSensorReadings();
    
        pastReadings.shift();
        pastReadings.push(readingsMean);

        resolve(pastReadings);
    });
}
 
async function getLightLevel() {
    if (averageQueue.length != averageQueueSize) {
        averageQueue = new Array(averageQueueSize).fill(await getAverageSensorReadings());
    }

    await appendNewReading(averageQueue);

    var newLightLevel = mean(averageQueue);
    
    // log new level
    log("got new light level: " + newLightLevel);

    logDatum(newLightLevel);

    return newLightLevel;
}

function logDatum(datum) {
    try {
        const filepath = `${dataDirectoryFilePath}/${new Date().toISOString().replace(/T.*/, '')}.json`;
    
        var data = {};

        if (fs.existsSync(filepath)) {
            data =jsonfile.readFileSync(filepath);
        }

        data[Date.now()] = datum;

        jsonfile.writeFileSync(filepath, data);
    } catch (e) {
        log(e);
    }
}

async function isDark() {
    // lower value means the detected light is bright 
    return (threshhold - await getLightLevel()) <= 0;
}

async function setDataDirectory(baseDataFilePath) {
    dataDirectoryFilePath = baseDataFilePath;
}

module.exports = {
    getLightLevel,
    isDark,
    setDataDirectory,
    setLogger
}

ON_DEATH(function(signal, err) {
    log("cleaning sensor GPIO");
    pins.map(x => x.unexport());
});
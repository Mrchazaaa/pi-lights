var ON_DEATH = require('death');
var Gpio = require('onoff').Gpio;

var pins = [
    new Gpio(4, 'out'),
    new Gpio(17, 'out'),
    // new Gpio(27, 'out')
];

var averageQueue = [];

var averageQueueSize = 50000;

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
    console.log("got new light level: " + newLightLevel);

    return newLightLevel;
}

// async function run() {
//     while(true) {
//         console.log(await getLightLevel());
//     }
// }

// run();

module.exports = {
    getLightLevel
}

ON_DEATH(function(signal, err) {
    console.log("cleaning sensor GPIO");
    pins.map(x => x.unexport());
});
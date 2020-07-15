var ON_DEATH = require('death');
var Gpio = require('onoff').Gpio;

var pins = [
    new Gpio(4, 'out'),
    new Gpio(17, 'out'),
    new Gpio(27, 'out')
];

var averageQueue = [];

var averageQueueSize = 3;

function mean(array) {
    try {
        return array.reduce((a, b) => a + b) / array.length;
    }
    catch(e) {
        return "A:D";
    }
}

function get_individual_sensor_reading(sensor) {
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

function get_average_sensor_readings() {
    return Promise.all(pins.map(x => get_individual_sensor_reading(x)))
        .then(values => {
            return mean(values);
        });
}

function append_new_reading(pastReadings) {
    return new Promise(async (resolve, reject) => {
        readingsMean = await get_average_sensor_readings();
    
        pastReadings.shift();
        pastReadings.push(readingsMean);

        resolve(pastReadings);
    });
}
 
async function getLightLevel() {
    if (averageQueue.length != averageQueueSize) {
        averageQueue = new Array(averageQueueSize).fill(await get_average_sensor_readings());
    }

    await append_new_reading(averageQueue);

    return mean(averageQueue);
}

// async function run() {
//     while(true) {
//         console.log(await getLightLevel());
//     }
// }

// run();

ON_DEATH(function(signal, err) {
    console.log("cleaning sensor GPIO");
    pins.map(x => x.unexport());
});
var ON_DEATH = require('death');
var Gpio = require('onoff').Gpio;

var pins = [
    new Gpio(4, 'out'),
    new Gpio(17, 'out'),
    new Gpio(27, 'out')
];

async function run() {

    var averageQueue = [await average_sensor_readings(), await average_sensor_readings(), await average_sensor_readings()]

    function mean(array) {
        return array.reduce((a, b) => a + b) / array.length;
    }

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    function rc_time(sensor) {
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

    function average_sensor_readings() {
        return Promise.all(pins.map(x => rc_time(x))).then((values) => {
            return mean(values);
        });
    }

    console.log(averageQueue);

    // Catch when script is interrupted, cleanup correctly
    // Main loop
    while (true) {
        readingsMean = await average_sensor_readings();
        
        averageQueue.shift();
        averageQueue.push(readingsMean);
    
        console.log(mean(averageQueue));
    }
}

run();

ON_DEATH(function(signal, err) {
    pins.map(x => x.unexport());
});
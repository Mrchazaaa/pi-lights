const fs = require('fs');
const jsonfile = require('jsonfile');

async function run() {
    // const filepath = './data/g7.json';
 
    // var data = {};

    // if (fs.existsSync(filepath)) {
    //     data =jsonfile.readFileSync(filepath);
    // }

    // data['4'] = "cool";

    // jsonfile.writeFileSync(filepath, data);

    var filePath = `/home/pi/workspace/lights/sensor/data/${new Date().toISOString().replace(/T.*/, '')}.json`;

    var dataPoints = [];
    var data = jsonfile.readFileSync(filePath);

    Object.keys(data).forEach(time => dataPoints.push({x: time, y: data[time].toString()}));

    console.log(dataPoints);
}

run();
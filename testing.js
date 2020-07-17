const fs = require('fs');
const jsonfile = require('jsonfile');

async function run() {
    const filepath = './data/g7.json';
 
    var data = {};

    if (fs.existsSync(filepath)) {
        data =jsonfile.readFileSync(filepath);
    }

    data['4'] = "cool";

    jsonfile.writeFileSync(filepath, data);
}

run();
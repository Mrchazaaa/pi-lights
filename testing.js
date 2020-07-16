const fs = require('fs')

async function run() {
    // store new light datum
    await fs.open(`./${new Date().toISOString().replace(/T.*/, '')}.json`, 'a+', async (err, data) => {
        var json = JSON.parse(data)
        json[Date.now()] = "newLightLevel";

        // await fs.writeFile("results.json", JSON.stringify(json))
    });
}

run();
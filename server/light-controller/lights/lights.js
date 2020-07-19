const { Discovery, Control } = require('magic-home');

function log(message) {
    console.log(`[Light] ${message}`);
}

async function discoverDevices() {
    log("discovering devices");
    var devices = (await Discovery.scan(10000)).map(device => new Control(device.address, {ack: Control.ackMask(1), connect_timeout: 5000}));

    var devicesById = devices.reduce((a, x) => ({...a, [x._address]: x}), {});
    log(`discovered: ${Object.keys(devicesById)}`);
    return devicesById;
}

async function turnOn(device) {
    return await handleConnectionErrors(async device => (await device.turnOn()), device, `turning on ${device._address}`);
}

async function turnOff(device) {
    return await handleConnectionErrors(async device => (await device.turnOff()), device, `turning off ${device._address}`);
}

async function areLightsOn(device) {
    return await handleConnectionErrors(async device => (await device.queryState()).on, device, `querying state of ${device._address}`);
}

async function handleConnectionErrors(operation, device, description) {
    try{
        log(description);
        var response = await operation(device);
        log(`${description} responded with ${response}`); 
        return response;
    }
    catch(e) {
        throw e;
    } 
}

module.exports = {
    discoverDevices,
    turnOn,
    turnOff,
    areLightsOn
}
const { Discovery, Control } = require('magic-home');

var devices = [];

function getDevices() {
    return devices;
}

async function discoverDevices() {
    console.log("discovering devices");
    devices = (await Discovery.scan(10000)).map(device => new Control(device.address, {ack: Control.ackMask(1), connect_timeout: 5000}));
    console.log("found:");
    devices.forEach(device => {
        console.log(device._address);
    });

    return devices.reduce((a, x) => ({...a, [x._address]: x}), {})
}

async function turnOn(device) {
    return await handleConnectionErrors(async device => (await device.turnOn()), device, "turning on lights");
}

async function turnOff(device) {
    return await handleConnectionErrors(async device => (await device.turnOff()), device, "turning off lights");
}

async function areLightsOn(device) {
    return await handleConnectionErrors(async device => (await device.queryState()).on, device, "querying state of lights");
}

async function handleConnectionErrors(operation, device, description) {
    try{
        console.log(description);
        return await operation(device);
    }
    catch(e) {
        console.log("could not connect to a light, removing.");
        var index = devices.indexOf(device);
        devices.splice(index);
    } 
}

module.exports = {
    discoverDevices,
    turnOn,
    turnOff,
    getDevices,
    areLightsOn
}
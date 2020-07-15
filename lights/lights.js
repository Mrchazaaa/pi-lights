const { Discovery, Control } = require('magic-home');

var devices = [];

function getDevices() {
    return devices;
}

async function initialize() {
    console.log("discovering devices");
    devices = (await Discovery.scan(10000)).map(device => new Control(device.address, {ack: Control.ackMask(1), connect_timeout: 5000}));
    console.log("found:");
    devices.forEach(device => {
        console.log(device._address);
    });
}

async function turnOn() {
    return Promise.all(devices.map(async device => {
        return await handleConnectionErrors(async device => (await device.turnOn()), device, "turning on lights");

        // try{
        //     console.log("turning on light");
        //     await device.turnOn();
        // }
        // catch(e) {
        //     console.log("could not connect to a light, removing.");
        //     var index = devices.indexOf(device);
        //     devices.splice(index);
        // }
    }));
}

async function turnOff() {
    return Promise.all(devices.map(async device => {
        return await handleConnectionErrors(async device => (await device.turnOff()), device, "turning off lights");
        // try{
        //     console.log("turning off light");
        //     await device.turnOff();
        // }
        // catch(e) {
        //     console.log("could not connect to a light, removing.");
        //     var index = devices.indexOf(device);
        //     devices.splice(index);
        // } 
    }));
}

async function getLightsOn() {
    return Promise.all(devices.map(async device => {
         return await handleConnectionErrors(async device => (await device.queryState()).on, device, "querying state of lights");
    }));
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
    initialize,
    turnOn,
    turnOff,
    getDevices,
    getLightsOn
}
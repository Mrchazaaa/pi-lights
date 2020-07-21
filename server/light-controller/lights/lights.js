const { timeout, TimeoutError } = require('promise-timeout');
const { Discovery, Control } = require('magic-home');

var _logger;

function log(message) {
    _logger.info(`[Light] ${message}`);
}

const promiseTimeout = 10000;

function setLogger(logger) {
    _logger = logger;
}

async function discoverDevices() {
    log("discovering devices");
    
    var devices = (await Discovery.scan(10000)).map(
        device => new Control(
            device.address, 
            {
                ack: Control.ackMask(1), 
                // connect_timeout: 10000, 
                log_all_received: true
            }
        )
    );

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
    return await handleConnectionErrors(async device => (await device.queryState()).on, device, `querying on state of ${device._address}`);
}

async function handleConnectionErrors(operation, device, description) {
    try{
        log(description);
        var response = await timeout(await operation(device), promiseTimeout);
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
    areLightsOn,
    setLogger
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTimeInMilliseconds(): number {
    return new Date().getTime();
}

export { sleep, getTimeInMilliseconds };
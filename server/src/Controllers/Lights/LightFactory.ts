import ILightFactory from './ILightFactory';
import Light from './Light';

export default class LightFactory implements ILightFactory {

    private lightPromiseTimeout: number;

    constructor(lightPromiseTimeout: number) {
        this.lightPromiseTimeout = lightPromiseTimeout;
    }

    createLight(address: string) {
        return new Light(address, this.lightPromiseTimeout);
    }
}

export { ILightFactory };
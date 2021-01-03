import LightState from './LightState';

export default interface ILight {
    address: string;

    getCachedOnState(): LightState;

    turnOnAsync(): Promise<boolean>;

    turnOffAsync(): Promise<boolean>;

    updateStateCacheAsync(): Promise<boolean>;

    setStrobe(): Promise<boolean>;

    setAmbient(): Promise<boolean>;
}
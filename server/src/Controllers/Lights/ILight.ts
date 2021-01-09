import LightState from './LightState';

export default interface ILight {
    address: string;

    getCachedOnState(): LightState;

    turnOnAsync(): Promise<boolean>;

    turnOffAsync(): Promise<boolean>;

    updateStateCacheAsync(): Promise<boolean>;

    setStrobeAsync(): Promise<boolean>;

    setAmbientAsync(): Promise<boolean>;
}
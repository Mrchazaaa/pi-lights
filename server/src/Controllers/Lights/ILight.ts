import LightState from './LightState';

export default interface ILight {
    address: string;

    cachedOnstate(): LightState;

    turnOnAsync(): Promise<boolean>;

    turnOffAsync(): Promise<boolean>;

    areLightsOnAsync(): Promise<boolean>;
}
import LightState from './LightState';

export default interface ILight {
    address: string;

    getCachedOnState(): LightState;

    turnOnAsync(): Promise<boolean>;

    turnOffAsync(): Promise<boolean>;

    areLightsOnAsync(): Promise<boolean>;
}
import ILight from './ILight';

export default interface ILightsManager {
    discoverDevices(): Promise<void>;

    getLights(): ILight[];

    areAllLightsDiscovered(): boolean;
}
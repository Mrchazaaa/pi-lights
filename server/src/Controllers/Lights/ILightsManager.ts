import ILight from './ILight';

export default interface ILightsManager {
    discoverDevicesAsync(): Promise<void>;

    getLights(): ILight[];

    areAllLightsDiscovered(): boolean;

    removeLight(lightAddress: string): void;
}
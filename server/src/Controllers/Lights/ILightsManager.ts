import IDisposable from 'src/Sensors/IDisposable';
import ILight from './ILight';

export default interface ILightsManager extends IDisposable {
    discoverDevicesAsync(): Promise<void>;

    getLights(): ILight[];

    areAllLightsDiscovered(): boolean;

    removeLight(lightAddress: string): void;
}
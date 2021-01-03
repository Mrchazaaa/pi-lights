import IDisposable from '../Utilities/IDisposable';

export default interface ILightSensingLightSwitcher extends IDisposable {
    runControlLoop(): Promise<void>;
}
import IDisposable from './Sensors/IDisposable';

export default interface ILightSensingLightSwitcher extends IDisposable {
	cancelControlLoop(): void;

    runControlLoopAsync(): Promise<void>;
}
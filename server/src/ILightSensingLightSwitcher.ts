export default interface ILightSensingLightSwitcher {
	cancelControlLoop(): void;
	
    runControlLoopAsync(): Promise<void>; 
}
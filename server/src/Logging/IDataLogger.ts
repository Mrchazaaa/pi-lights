export default interface IDataLogger {
    logLux(datum: number, threshold: number): Promise<void>;
    logThreshold(datum: number): Promise<void>;
    logLightState(datum: { name: string, state: number }[] ): Promise<void>;
}
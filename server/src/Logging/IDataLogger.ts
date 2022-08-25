export default interface IDataLogger {
    log(datum: number, threshold: number): void;
}
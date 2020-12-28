export default interface ILogger {
    error: (message: any) => void;
    info: (message: string) => void;
}
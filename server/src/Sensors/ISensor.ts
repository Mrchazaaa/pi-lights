export default interface ISensor {
    getReadingAsync(): Promise<number>;
    dispose(): void;
}
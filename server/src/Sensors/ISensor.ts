import IDisposable from './IDisposable';

export default interface ISensor<TResult> extends IDisposable {
    getReadingAsync(): Promise<TResult>;
}
import IDisposable from '../Utilities/IDisposable';

export default interface ISensor<TResult> extends IDisposable {
    getReadingAsync(): Promise<TResult>;
}
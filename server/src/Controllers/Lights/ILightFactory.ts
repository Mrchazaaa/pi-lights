import ILight from './ILight';

export default interface ILightFactory {
    createLight(address: string): ILight
}

export { ILight };
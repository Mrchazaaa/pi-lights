export default interface IAveragingLightSensorsManager {
    isDarkAsync(): Promise<boolean>;
}
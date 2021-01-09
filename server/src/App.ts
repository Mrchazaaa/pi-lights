import LightSensingLightSwitcher, { ILightSensingLightSwitcher } from './Services/LightSensingLightSwitcher';
import LoggerProvider, { ILogger } from './Logging/LoggerProvider';
import LightsManager, { ILightsManager } from './Controllers/Lights/LightsManager';
import SensorReadRateLimitWrapper from './Sensors/SensorReadRateLimitDecorator';
import LightFactory from './Controllers/Lights/LightFactory';
import TSL2561 from './Sensors/LightSensor/TSL2561';
import LightSensor from './Sensors/LightSensor/LightSensor';
import ButtonManager, { IButtonManager } from './Sensors/Button/ButtonManager';
import MeanSensorDecorator from './Sensors/MeanSensorDecorator';

const discoveryRateLimit = 10000;
const numberOfLights = 2;
const lightPromiseTimeout = 10000;
const lightSensorReadRateLimit = 500;
const isDarkThreshold = 0.3;

export default class App {
    private logger: ILogger;
    private lightsManager: ILightsManager;
    private lightSensingLightSwitcher: ILightSensingLightSwitcher;
    private buttonManager: IButtonManager;
    private shouldControlLoopRun: boolean;

    constructor() {
        this.logger = LoggerProvider.createLogger(App.name);

        this.lightsManager = new LightsManager(
            discoveryRateLimit,
            numberOfLights,
            new LightFactory(lightPromiseTimeout));

            this.lightSensingLightSwitcher = new LightSensingLightSwitcher(
                this.lightsManager,
                new SensorReadRateLimitWrapper(
                    new MeanSensorDecorator(
                        5,
                        new LightSensor(new TSL2561(2, 16))
                    ),
                    lightSensorReadRateLimit),
                isDarkThreshold);

            this.buttonManager = new ButtonManager(this.lightsManager);

        this.shouldControlLoopRun = false;
    }

    public async start() {
        this.buttonManager.initialize();

		this.shouldControlLoopRun = true;

		while(this.shouldControlLoopRun) {
            await this.lightSensingLightSwitcher.runControlLoop();
		}
    }

    public dispose() {
        this.logger.info('Disposing.');
        this.shouldControlLoopRun = false;
        this.lightSensingLightSwitcher.dispose();
        this.buttonManager.dispose();
    }
}

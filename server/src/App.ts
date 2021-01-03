import LightSensingLightSwitcher, { ILightSensingLightSwitcher } from './Services/LightSensingLightSwitcher';
import LoggerProvider, { ILogger } from './Logging/LoggerProvider';
import LightsManager, { ILightsManager } from './Controllers/Lights/LightsManager';
import SensorReadRateLimitWrapper from './Sensors/SensorReadRateLimitDecorator';
import LightFactory from './Controllers/Lights/LightFactory';
import TSL2561 from './Sensors/LightSensor/TSL2561';
import ButtonManager, { IButtonManager } from './Sensors/Button/ButtonManager';

export default class App {
    private logger: ILogger;
    private lightsManager: ILightsManager;
    private lightSensingLightSwitcher: ILightSensingLightSwitcher;
    private buttonManager: IButtonManager;
    private shouldControlLoopRun: boolean;

    constructor() {
        this.logger = LoggerProvider.createLogger(App.name);

        this.lightsManager = new LightsManager(10000, 2, new LightFactory(10000));
        this.lightSensingLightSwitcher = new LightSensingLightSwitcher(this.lightsManager, new SensorReadRateLimitWrapper(new TSL2561(2, 16), 500), 0.3);
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

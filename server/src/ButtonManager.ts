import LoggerProvider, { ILogger } from './Logging/LoggerProvider';
import ILightsManager from './Controllers/Lights/ILightsManager';
import Buttons from './Sensors/Button/Buttons';
import IDisposable from './Sensors/IDisposable';
import IButtons from './Sensors/Button/IButtons';
import ILight from './Controllers/Lights/ILight';

export default class ButtonManager implements IDisposable {

	private logger: ILogger;
	private lightsManager: ILightsManager;
	private buttons: IButtons;

	constructor(lightsManager: ILightsManager) {
		this.logger = LoggerProvider.createLogger(ButtonManager.name);

        this.lightsManager = lightsManager;

        const lightCallback = (async () => {
            const lights = this.lightsManager.getLights();

            lights.forEach(await this.toggleLightIfOn.bind(this));
        }).bind(this);

        this.logger.info('Initializing button manager.');

        this.buttons = new Buttons(new Map([
            [21, lightCallback],
            [26, lightCallback],
            [16, lightCallback]
        ]));
    }

    private async toggleLightIfOn(): Promise<void> {
        const logger = this.logger;

        const lights = this.lightsManager.getLights();

        lights.forEach(async (light: ILight) => {
            const state = await light.updateStateCacheAsync();

            logger.info('Toggling lights.');

            if (state)
            {
                await light.turnOffAsync()
            }
            else
            {
                await light.turnOnAsync()
            }
        });
    }

    dispose(): void {
        this.buttons.dispose();
    }
}

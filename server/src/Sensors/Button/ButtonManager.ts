import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import ILightsManager from '../../Controllers/Lights/ILightsManager';
import Button from '../../Sensors/Button/Button';
import IButton from '../../Sensors/Button/IButton';
import ILight from '../../Controllers/Lights/ILight';
import IButtonManager from './IButtonManager';

export default class ButtonManager implements IButtonManager {
	private logger: ILogger;
	private lightsManager: ILightsManager;
	private buttons: IButton[];

	constructor(lightsManager: ILightsManager) {
		this.logger = LoggerProvider.createLogger(ButtonManager.name);

        this.lightsManager = lightsManager;

        this.logger.info('Initializing button manager.');

        this.buttons = [];
    }

    public initialize() {
        this.buttons = [new Button(6, this.toggleLight.bind(this), 10), new Button(16, this.setStrobe.bind(this), 10)];
    }

    private async toggleLight(): Promise<void> {
        this.logger.info('Toggling lights.');

        const lights = this.lightsManager.getLights();

        console.log(`Starting the toggle ${lights.map(light => light.address)}.`);

        lights.forEach(async (light: ILight) => {
                const state = await light.updateStateCacheAsync();

                console.log(state);

                if (state) {
                    console.log('not doin it');
                    await light.turnOffAsync();
                }

                else {
                    console.log('doin it');
                    await light.turnOnAsync();
                }
            });
    }

    private async setAmbient(): Promise<void> {
        const logger = this.logger;

        const lights = this.lightsManager.getLights();

        logger.info('Setting ambient lighting.');

        lights.forEach(async (light: ILight) => {
            await light.setAmbientAsync()
        });
    }

    private async setStrobe(): Promise<void> {
        const logger = this.logger;

        const lights = this.lightsManager.getLights();

        logger.info('Setting strobe lighting.');

        lights.forEach(async (light: ILight) => {
            await light.setStrobeAsync()
        });
    }

    dispose(): void {
        this.logger.info('Disposing.');

        this.buttons.forEach(button => button.dispose());
    }
}

export { IButtonManager };
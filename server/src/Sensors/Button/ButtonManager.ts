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
        this.buttons = [];
    }

    public initialize() {
        this.logger.info('Initializing button manager.');

        this.buttons = [
            new Button(6, 10, this.toggleLight.bind(this)),
            new Button(16, 10, this.setStrobe.bind(this))
        ];
    }

    private async toggleLight(): Promise<void> {
        const lights = this.lightsManager.getLights();

        lights.forEach(async (light: ILight) => {
            await light.toggleAsync();
        });
    }

    private async setAmbient(): Promise<void> {
        const lights = this.lightsManager.getLights();

        lights.forEach(async (light: ILight) => {
            await light.setAmbientAsync()
        });
    }

    private async setStrobe(): Promise<void> {
        const lights = this.lightsManager.getLights();

        lights.forEach(async (light: ILight) => {
            await light.setStrobeAsync()
        });
    }

    public dispose(): void {
        this.logger.info('Disposing.');
        this.buttons.forEach(button => button.dispose());
    }
}

export { IButtonManager };
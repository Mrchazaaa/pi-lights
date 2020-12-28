import GPIOButtons from 'rpi-gpio-buttons';
import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import IButtons from './IButtons';

export default class Buttons implements IButtons {
    private logger: ILogger;
    private buttons: GPIOButtons;

    constructor(pinsToCallbacks: Map<number, () => Promise<void>>) {
        const logger = LoggerProvider.createLogger(Buttons.name);

        this.logger = logger;

        const buttons = new GPIOButtons({ pins: Array.from(pinsToCallbacks.keys()) });

        buttons
            .on('pressed', async pin => {
                logger.info(`Button clicked for pin ${pin}.`);

                const callback = pinsToCallbacks.get(pin);

                if (callback)
                {
                    await callback();
                }
            })
            .on('error', error => {
                logger.error(error);
            });

        this.logger.info(`Initialiazing buttons with keys ${Array.from(pinsToCallbacks.keys())}.`);

        buttons.init();

        this.buttons = buttons;
    }

    public dispose() {
        this.buttons.destroy();
    }
}

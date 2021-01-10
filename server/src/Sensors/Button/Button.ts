import { Gpio } from 'onoff';
import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import IButton from './IButton';

export default class Button implements IButton {
    private logger: ILogger;
    private button: Gpio;

    constructor(pin: number, debounceTimeout: number, pressedCallback: () => Promise<any>) {
        this.logger = LoggerProvider.createLogger(Button.name);

        const buttons = new Gpio(pin, 'in', 'falling', {debounceTimeout});

        buttons
            .watch((async (error, _) => {
                this.logger.info(`Button clicked for pin ${pin}.`);

                if (error) {
                    this.logger.error(error);
                } else {
                    await pressedCallback();
                }
            }).bind(this));

        this.logger.info(`Initialiazing button with pin ${pin}.`);

        this.button = buttons;
    }

    public dispose() {
        this.logger.info('Disposing.');
        this.button.unexport();
    }
}

export { IButton };
import { Gpio } from 'onoff';
import ISensor from '../ISensor';
import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';

export default class LightSensor implements ISensor {
    private logger: ILogger;
    private GPIO: Gpio;

    constructor(sensorGPIO: number) {
        this.logger = LoggerProvider.createLogger(LightSensor.constructor.name);
        this.GPIO = new Gpio(sensorGPIO, 'out');
    }

    public getReadingAsync(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let count = 0;

            this.GPIO.setDirection('out');

            await this.GPIO.write(0);

            setTimeout(async (gpio: Gpio) => {

                gpio.setDirection('in');

                // Count until the pin goes high
                while (await gpio.read() === 0) {
                    count += 1;
                }

                resolve(count);
            }, 100, this.GPIO);
        });
    }

    public dispose() {
        this.GPIO.unexport();
    }
}

export { ISensor };
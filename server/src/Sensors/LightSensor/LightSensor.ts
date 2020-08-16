import { Gpio } from 'onoff';
import LoggerFactory from '../../Logging/WinstonLoggerFactory';
import ILogger from '../../Logging/ILogger'

export default class LightSensor {
    private logger: ILogger;
    private GPIO: Gpio;

    constructor(sensorGPIO: number) {
        this.logger = LoggerFactory.createLogger(LightSensor.constructor.name);
        this.GPIO = new Gpio(sensorGPIO, 'out');
    }

    public getLightReading(): Promise<number> {
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
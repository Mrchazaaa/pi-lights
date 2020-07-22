import { Gpio } from 'onoff';
import LoggerFactory from '../../logging/WinstonLoggerFactory';
import ILogger from '../../logging/ILogger'

export default class LightSensor {
    private logger: ILogger;
    private GPIO: Gpio;

    constructor(GPIOPIn: number) {
        this.logger = LoggerFactory.createLogger(LightSensor.constructor.name);
        this.GPIO = new Gpio(GPIOPIn, 'out');
    }

    public getLightReading(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            var count = 0;
    
            this.GPIO.setDirection('out');
        
            await this.GPIO.write(0);
            
            setTimeout(async function() {
                
                this.GPIO.setDirection('in');
                
                // Count until the pin goes high
                while (await this.GPIO.read() == 0) {
                    count += 1;
                }
    
                resolve(count);
            }, 100);
        });
    }

    public dispose() {
        this.GPIO.unexport();
    }
}
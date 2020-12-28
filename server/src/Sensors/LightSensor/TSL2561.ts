import i2c, { PromisifiedBus } from 'i2c-bus';
import LoggerProvider, { ILogger } from '../../Logging/LoggerProvider';
import { sleep } from '../../TimingHelper';
import ISensor from '../ISensor';

interface TReading {
    ambient: number;
    IR: number;
}

export default class TSL2561 implements ISensor<TReading> {
    private logger: ILogger;
    private address: number;
    private pause: number;
    private gain: number;
    private bus: PromisifiedBus | null;

    constructor(pause: number, gain: number) {
        this.logger = LoggerProvider.createLogger(TSL2561.name);
        this.address = 0x39;;
        this.pause = pause;
        this.gain = gain;
        this.bus = null;
    }

    private async init(): Promise<void> {
        this.logger.info('Initializing sensor.');

        this.bus = await i2c.openPromisified(1);
        await this.bus.writeByte(this.address, 0x80, 0x03); // enable the device
    }

    // Grabs a lux reading either with autoranging (gain=0) or with a specified gain (1, 16)
    public async getReadingAsync(): Promise<TReading> {
        if (!this.bus) await this.init();

        this.logger.info('Reading lux.');

        const gain = 0;
        let ambient;
        let IR;

        // if (gain === 1 || gain === 16) {
        //     await this.setGain(gain) // low/highGain
        //     ambient = await this.readFull()
        //     IR = await this.readIR()
        // }
        if (gain === 0) { // auto gain
            await this.setGain(16) // first try highGain
            ambient = await this.readFull()
            if (ambient < 65535) {
                IR = await this.readIR()
            }
            if (ambient >= 65535 || IR >= 65535) { // value(s) exeed(s) datarange
                await this.setGain(1) // set lowGain
                ambient = await this.readFull();
                IR = await this.readIR();
            }
        }
        // if (this.gain === 1) {
        //    ambient *= 16 // scale 1x to 16x
        //    IR *= 16 // scale 1x to 16x
        // }

        const ratio = (IR / parseFloat(ambient)) // changed to make it run under python 2

        let lux: number = 0;

        if ((ratio >= 0) && (ratio <= 0.52)) {
            lux = (0.0315 * ambient) - (0.0593 * ambient * (ratio**1.4))
        }
        else if (ratio <= 0.65) {
            lux = (0.0229 * ambient) - (0.0291 * IR)
        }
        else if (ratio <= 0.80) {
            lux = (0.0157 * ambient) - (0.018 * IR)
        }
        else if (ratio <= 1.3) {
            lux = (0.00338 * ambient) - (0.0026 * IR)
        }
        else if (ratio > 1.3) {
            lux = 0
        }

        return { ambient: lux, IR };
    }

    private async readFull(reg = 0x8C): Promise<number> {
        return await this.readWord(reg);
    }

    // Reads IR only diode from the I2C device
    private async readIR(reg = 0x8E): Promise<number> {
        return await this.readWord(reg);
    }

    // Set the gain
    private async setGain(gain = 1): Promise<void> {
        if (gain !== this.gain) {
            if (gain === 1) {
                await (await this.getBus()).writeByte(this.address, 0x81, 0x02) // set gain = 1X and timing = 402 mSec
            }
            else {
                await (await this.getBus()).writeByte(this.address, 0x81, 0x12) // set gain = 16X and timing = 402 mSec
                this.gain = gain; // safe gain for calculation
                await sleep(this.pause) // pause for integration (this.pause must be bigger than integration time)
            }
        }
    }

    // Reads a word from the I2C device
    private async readWord(reg): Promise<number> {
        try {
            const wordval = await (await this.getBus()).readWord(this.address, reg);
            // var newval = this.i2c.reverseByteOrder(wordval)
            return wordval;
        }
        catch (error) {
            this.logger.error(`Error accessing ${this.address}: Check your I2C address`);
            throw error;
        }
    }

    private async getBus(): Promise<PromisifiedBus> {
        if (this.bus === null) {
            this.bus = await i2c.openPromisified(1);
            await this.bus.writeByte(this.address, 0x80, 0x03); // enable the device
        }

        return this.bus;
    }

    public async dispose() {
        this.logger.info('Disposing.');

        await (await this.getBus()).close();
    }
}
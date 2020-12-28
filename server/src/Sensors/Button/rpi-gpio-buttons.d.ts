declare module "rpi-gpio-buttons" {
    interface IGPIOButtons {
        on(event: string, callback: (pin: number) => void): IGPIOButtons;
        on(event: string, callback: (type: string, ping: number) => void): IGPIOButtons;
        on(event: string, callback: (error: string) => void): IGPIOButtons;

        init(): Promise<IGPIOButtons>;

        destroy(): void;
    }

    class GPIOButtons implements IGPIOButtons {
        constructor (options: {
            pins: number[]
        });

        on(event: string, callback: (pin: number) => void): IGPIOButtons;
        on(event: string, callback: (type: string, ping: number) => void): IGPIOButtons;
        on(event: string, callback: (error: string) => void): IGPIOButtons;

        init(): Promise<IGPIOButtons>;

        destroy(): void;
    }

    export = GPIOButtons;
}
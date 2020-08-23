declare module "magic-home" {
    interface IDeviceOptions {
        address: string
    }

    interface IDiscovery {
        scan(timeout: number): IDeviceOptions[];
    }

    interface IControlState {
        on: boolean;
    } 

    interface IAckMask {
        power: boolean,
        color: boolean,
        patter: true,
        custom_pattern: true
    }

    interface IControl {
        new (lightAddress: string, options: {
            ack: IAckMask,
            log_all_received: boolean
        }): IControl;

        ackMask(mask: number): IAckMask;
        turnOn(): Promise<boolean>;
        turnOff(): Promise<boolean>;
        queryState(): Promise<IControlState>;
        _address: string;
    }

    export var Discovery: IDiscovery;
    export var Control: IControl;
}
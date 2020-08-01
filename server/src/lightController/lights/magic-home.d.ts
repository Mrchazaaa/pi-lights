declare module "magic-home" {
    interface IDiscovery {
        scan(timeout: number): {address: string}[];
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
        turnOn(): boolean;
        turnOff(): boolean;
        queryState(): IControlState 
        _address: string;
    }

    export var Discovery: IDiscovery;
    export var Control: IControl;
}
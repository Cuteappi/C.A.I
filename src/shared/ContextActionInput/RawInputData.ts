import { TAllKeysCategorizedValues } from "./InputTypes";

type KeyBuffer = {
    Current: boolean;
    Previous: boolean;
    Pre_Previous: boolean;
};

export class RawInputData {
    public Key: TAllKeysCategorizedValues;
    public Delta: Vector3 = Vector3.zero;
    public Position: Vector3 = Vector3.zero;
    public IsActive: boolean = false;
    public IsChanged: boolean = false;
    public KeyBuffer: KeyBuffer = {
        Current: false,
        Previous: false,
        Pre_Previous: false,
    };

    constructor(key: TAllKeysCategorizedValues) {
        this.Key = key;
    }

    UpdateKey(key: TAllKeysCategorizedValues) {
        this.Key = key;
    }


    UpdateKeybuffer() {
        this.KeyBuffer.Pre_Previous = this.KeyBuffer.Previous;
        this.KeyBuffer.Previous = this.KeyBuffer.Current;
        this.KeyBuffer.Current = this.IsActive;
    }

}
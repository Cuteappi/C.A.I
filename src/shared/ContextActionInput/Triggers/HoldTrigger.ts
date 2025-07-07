import { BaseTrigger } from "./BaseTrigger";
import { ActionValueType, TriggerState } from "../Models/Enums";

export class HoldTrigger extends BaseTrigger {
    private _HoldTime: number;
    private _IsOneShot: boolean;

    private _accumulatedTime = 0;
    private _didShoot = false;


    constructor(actionValueType: ActionValueType, holdTime: number = 1, isOneShot: boolean = false) {
        super(actionValueType);
        this._HoldTime = holdTime;
        this._IsOneShot = isOneShot;
    }

    public getProgress() {
        return math.clamp(this._accumulatedTime / this._HoldTime, 0, 1);
    }

    public UpdateState(currentInput: Vector3, lastInput: Vector3, delta: number): TriggerState {
        if (this.isActuated(currentInput)) {
            this._accumulatedTime += delta;

            if (this._accumulatedTime >= this._HoldTime) {
                if (this._IsOneShot && this._didShoot) {
                    return TriggerState.None;
                } else {
                    this._didShoot = true;
                    print("Triggered");
                    return TriggerState.Triggered;
                }
            } else {
                return TriggerState.OnGoing;
            }
        } else {
            this._accumulatedTime = 0;
            this._didShoot = false;
            return TriggerState.None;
        }
    }

    private isActuated(input: Vector3): boolean {
        switch (this.ActionValueType) {
            case ActionValueType.Bool:
            case ActionValueType.Axis1D:
                return math.abs(input.X) > 0;
            case ActionValueType.Axis2D:
                return math.abs(input.X) > 0 || math.abs(input.Y) > 0;
            default:
                return false;
        }
    }
}

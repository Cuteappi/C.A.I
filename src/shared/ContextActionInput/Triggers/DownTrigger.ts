import { BaseTrigger } from "./BaseTrigger";
import { ActionValueType, TriggerState } from "../Models/Enums";


export class DownTrigger extends BaseTrigger {
    constructor(actionValueType: ActionValueType) {
        super(actionValueType);
    }

    public UpdateState(currentInput: Vector3, lastInput: Vector3, delta: number): TriggerState {
        if (this.isActuated(currentInput)) {
            return TriggerState.Triggered;
        }
        return TriggerState.None;
    }

    private isActuated(input: Vector3): boolean {
        return math.abs(input.X) > 0 || math.abs(input.Y) > 0 || math.abs(input.Z) > 0;
    }
}

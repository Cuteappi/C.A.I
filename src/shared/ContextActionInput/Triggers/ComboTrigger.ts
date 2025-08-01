import { BaseTrigger } from "./BaseTrigger";
import { ActionValueType, TriggerState } from "../Models/Enums";


export class ComboTrigger extends BaseTrigger {
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

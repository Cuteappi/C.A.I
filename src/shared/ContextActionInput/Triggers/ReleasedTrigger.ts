import { BaseTrigger } from "./BaseTrigger";
import { ActionValueType, TriggerState } from "../Models/Enums";

export class ReleasedTrigger extends BaseTrigger {
    constructor(actionValueType: ActionValueType) {
        super(actionValueType);
    }

    public UpdateState(currentInput: Vector3, lastInput: Vector3, delta: number): TriggerState {
        const isCurrentlyPressed = this.isActuated(currentInput);
        const wasPreviouslyPressed = this.isActuated(lastInput);

        if (!isCurrentlyPressed && wasPreviouslyPressed) {
            print("Triggered");
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

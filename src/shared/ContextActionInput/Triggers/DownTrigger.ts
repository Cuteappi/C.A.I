import { BaseTrigger } from "./BaseTrigger";
import { ActionValueType, TriggerState } from "../Enums";


export class DownTrigger extends BaseTrigger {
    constructor(actionValueType: ActionValueType) {
        super(actionValueType);
    }

    public UpdateState(currentInput: Vector3, LastInput: Vector3, delta: number): TriggerState {

        switch (this.ActionValueType) {
            case ActionValueType.Bool:
            case ActionValueType.Axis1D:
                return math.abs(currentInput.X) > 0 ? TriggerState.Triggered : TriggerState.None;
            case ActionValueType.Axis2D:
                return math.abs(currentInput.X) > 0 || math.abs(currentInput.Y) > 0 ? TriggerState.Triggered : TriggerState.None;
        }
    }

}

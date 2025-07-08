import { ActionValueType, TriggerState } from "../Models/Enums";

/**
 * The type of a trigger, determining how it contributes to an action's activation.
 */
export enum TriggerType {
    Explicit = 1,
    Implicit = 2,
    Blocking = 3,
}

export abstract class BaseTrigger {
    ActionValueType: ActionValueType;

    constructor(actionValueType: ActionValueType) {
        this.ActionValueType = actionValueType;
    }


    public GetTriggerType(): TriggerType {
        return TriggerType.Explicit;
    }

    public UpdateState(currentInput: Vector3, LastInput: Vector3, delta: number): TriggerState {
        return TriggerState.None;
    }


    // protected isActuated(): boolean {
    //     if (!InputManager.activeKeys.has(this.Key)) return false;
    //     const KeyData = InputManager.activeKeys.get(this.Key);
    //     if (!KeyData) return false;
    //     if (KeyData.IsActive) return true;
    //     return false;
    // }
}

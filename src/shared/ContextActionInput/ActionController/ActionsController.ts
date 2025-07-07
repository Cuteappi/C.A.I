import {
    EDebugInputActions,
    EGameplayInputActions,
    EInputActions,
    EMenuInputActions,
    InputContextType,
    InputKeyCode,
} from "../Models/Enums";

export namespace ActionsController {
    type ActionMap = Record<InputContextType, Map<EInputActions, InputKeyCode[]>>;

    const ActionsMap = identity<ActionMap>({
        [InputContextType.GamePlay]: new Map<EGameplayInputActions, InputKeyCode[]>(),
        [InputContextType.Menu]: new Map<EMenuInputActions, InputKeyCode[]>(),
        [InputContextType.Debug]: new Map<EDebugInputActions, InputKeyCode[]>(),
    });

    export function AddAction(
        context: InputContextType,
        action: EInputActions,
        keycodes: InputKeyCode[],
    ) {
        if (!ActionsMap[context].has(action)) {
            ActionsMap[context].set(action, keycodes);
        }
        warn(`Action ${action} already exists in context ${context}`);
    }

    export function RemoveAction(context: InputContextType, action: EInputActions) {
        ActionsMap[context].delete(action);
    }

    export function GetAction(context: InputContextType, action: EInputActions) {
        return ActionsMap[context].get(action);
    }

    export function GetAllActionsByContext(context: InputContextType) {
        return ActionsMap[context];
    }

    export function GetAllActions() {
        return ActionsMap;
    }

    export function IsPressed() { }
    export function IsReleased() { }
    export function Press() { }
    export function Release() { }
}

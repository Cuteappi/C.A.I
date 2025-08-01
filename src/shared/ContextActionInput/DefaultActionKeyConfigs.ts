import { Action } from "./Action";
import { EDebugInputActions, EGameplayInputActions, EInputActions, InputContextType } from "./Models/Enums";
import { InputMapping } from "./InputMapping";
import { KeyboardMouseKeys, GamepadKeys } from "./Models/InputTypes";
import { ActionValueType } from "./Models/Enums";

type ActionMapping = {
    Action: (actionName: EInputActions) => Action;
    KeyBoardMouseMapping: Partial<Record<keyof KeyboardMouseKeys, () => InputMapping>>,
    GamepadMapping?: Partial<Record<keyof GamepadKeys, () => InputMapping>>,
};

export type ActionKeyConfig = Partial<Record<EInputActions, ActionMapping>>;

export type ContextActionKeyConfig = Record<InputContextType, ActionKeyConfig>;



const GameplayContextActionKeyConfig: ActionKeyConfig = {
    [EGameplayInputActions.Move]: {
        Action: (actionName) => new Action(actionName, true),
        KeyBoardMouseMapping: {
            "W": () => new InputMapping(Enum.KeyCode.W).SetModifiers(
                { modifier: "Negate" },
                { modifier: "InputSwizzle", settings: { order: "ZYX" } }
            ),
            "A": () => new InputMapping(Enum.KeyCode.A).SetModifiers({ modifier: "Negate" }),
            "S": () => new InputMapping(Enum.KeyCode.S).SetModifiers({ modifier: "InputSwizzle", settings: { order: "ZYX" } }),
            "D": () => new InputMapping(Enum.KeyCode.D),
        },
        GamepadMapping: {
            "Thumbstick1": () => new InputMapping(Enum.KeyCode.Thumbstick1, { actionValueType: ActionValueType.Axis2D })
                .SetModifiers(
                    { modifier: "Deadzone", settings: { lowerThreshold: 0.1, upperThreshold: 1 } },
                    { modifier: "InputSwizzle", settings: { order: "XZY" } },
                ),
        },
    },

    [EGameplayInputActions.Interact]: {
        Action: (actionName) => new Action(actionName, false),
        KeyBoardMouseMapping: {
            "E": () => new InputMapping(Enum.KeyCode.E).SetTrigger("PressedTrigger"),
        },
    },

};


const MenuContextActionKeyConfig: ActionKeyConfig = {

};

const DebugContextActionKeyConfig: ActionKeyConfig = {
    [EDebugInputActions.Toggle]: {
        Action: (actionName) => new Action(actionName, false),
        KeyBoardMouseMapping: {
            "F2": () => new InputMapping(Enum.KeyCode.F2).SetTrigger("PressedTrigger"),
        },
    },
};


export const DefaultContextActionKeyConfig: ContextActionKeyConfig = {
    [InputContextType.GamePlay]: GameplayContextActionKeyConfig,
    [InputContextType.Menu]: MenuContextActionKeyConfig,
    [InputContextType.Debug]: DebugContextActionKeyConfig,
};

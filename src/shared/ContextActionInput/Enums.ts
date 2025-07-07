export enum InputContextType {
    Menu,
    GamePlay,
    Debug,
}

export enum EGameplayInputActions {
    Jump = "Gameplay_Jump",
    Move = "Gameplay_Move",
    Sprint = "Gameplay_Sprint",
    Crouch = "Gameplay_Crouch",
    Interact = "Gameplay_Interact",
}

export enum EMenuInputActions {
    Up = "Menu_Up",
    Down = "Menu_Down",
    Left = "Menu_Left",
    Right = "Menu_Right",
    Select = "Menu_Select",
    Back = "Menu_Back",
}

export enum EDebugInputActions {
    Toggle = "Debug_Toggle",
}

export type EInputActions = EGameplayInputActions | EMenuInputActions | EDebugInputActions;

export type InputKeyCode = Enum.KeyCode | Enum.UserInputType;

export interface IInputMap {
    readonly Gamepad?: InputKeyCode;
    readonly KeyboardAndMouse?: InputKeyCode;
}

export enum EActionSpace {
    boolean,
    OneD,
    TwoD,
    ThreeD,
}

export enum ActionState {
    Completed,
    OnGoing,
    Triggered,
}


export enum TriggerState {
    None,
    Ongoing,
    Triggered,
}

export enum ActionValueType {
    Bool = 1,
    Axis1D = 2,
    Axis2D = 3,
}

export enum PositionType {
    Delta,
    Position
}

export enum Axis {
    X,
    Y,
    Z,
}

export enum InputKeyCodesType {
    JoySticks,
    JoyButtons,
    MouseButtons,
    MouseRest,
    Keys,
}
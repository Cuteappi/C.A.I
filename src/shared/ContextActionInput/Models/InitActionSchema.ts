import { ActionValueType, PositionType, Axis } from "./Enums";
import { TAllKeysCategorizedValues } from "./InputTypes";
import { ModifierFunction } from "../Modifiers";
import { TriggerSchema, TriggerType } from "../Triggers";

export type InitActionSchema = {
    KeyboardMouse: Array<InitInputMappingSchema<TriggerType>>,
    Gamepad?: Array<InitInputMappingSchema<TriggerType>>,

};

export type InitInputMappingSchema<T extends TriggerType> = {
    Key: TAllKeysCategorizedValues,
    ActionValueType: ActionValueType,
    Axis: Axis;
    PositionType: PositionType;
    Modifiers: ModifierFunction[];
    Trigger: TriggerSchema<T>;
};




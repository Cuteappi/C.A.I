import Object from "@rbxts/object-utils";
import { ActionValueType } from "../Models/Enums";
import {
	AllKeysCategorized,
	JoyButtons,
	JoySticks,
	KeyboardButtons,
	MouseActions,
	MouseButtons,
	TAllKeysCategorizedValues
} from "../Models/InputTypes";
import { DeviceType, DeviceTypeRecord } from "../Models/types";

export enum GetKeyMode {
	Keycode,
	InputObject,
}

function getKeysfromInputObject(input: InputObject):
	TAllKeysCategorizedValues | undefined {
	// if (input.UserInputType === Enum.UserInputType.Touch) {
	// 	return AllKeysCategorized.Axis1D.TouchActions[input.UserInputType.Name as keyof TouchActions];
	// }

	if (string.sub(input.UserInputType.Name, 1, 7) === "Gamepad") {
		const key = AllKeysCategorized.Axis1D.JoySticks[input.KeyCode.Name as keyof JoySticks];
		if (!key) {
			return AllKeysCategorized.Buttons.JoyButtons[input.KeyCode.Name as keyof JoyButtons];
		}
		return key;


	} else if (string.sub(input.UserInputType.Name, 1, 5) === "Mouse") {
		const key = AllKeysCategorized.Axis1D.MouseActions[input.UserInputType.Name as keyof MouseActions];
		if (!key) {
			return AllKeysCategorized.Buttons.MouseButtons[input.UserInputType.Name as keyof MouseButtons];
		}
		return key;


	} else if (input.UserInputType === Enum.UserInputType.Keyboard) {
		return AllKeysCategorized.Buttons.KeyboardButtons[input.KeyCode.Name as keyof KeyboardButtons];

	} else return;
}

function getKeysfromKeycode(input: Enum.KeyCode | Enum.UserInputType):
	TAllKeysCategorizedValues | undefined {

	let key: TAllKeysCategorizedValues | undefined;

	key = AllKeysCategorized.Axis1D.JoySticks[input.Name as keyof JoySticks];
	if (key) return key;

	key = AllKeysCategorized.Buttons.JoyButtons[input.Name as keyof JoyButtons];
	if (key) return key;

	key = AllKeysCategorized.Axis1D.MouseActions[input.Name as keyof MouseActions];
	if (key) return key;

	key = AllKeysCategorized.Buttons.MouseButtons[input.Name as keyof MouseButtons];
	if (key) return key;

	key = AllKeysCategorized.Buttons.KeyboardButtons[input.Name as keyof KeyboardButtons];
	if (key) return key;
	return;
}



/* ----------------------------------------------------------------------------------- */
/*     function that gets the corresponding key from the input object or keycode       */
/* ----------------------------------------------------------------------------------- */

export function GetCorrespondingKey(mode: GetKeyMode, input: Enum.KeyCode | Enum.UserInputType | InputObject):
	TAllKeysCategorizedValues | undefined {

	if (mode === GetKeyMode.Keycode) return getKeysfromKeycode(input as Enum.KeyCode | Enum.UserInputType);
	else return getKeysfromInputObject(input as InputObject);
}


/* ----------------------------------------------------------------------------------- */
/*     function that gets the corresponding key from the input object or keycode       */
/* ----------------------------------------------------------------------------------- */

export function GetInputAxis(key: TAllKeysCategorizedValues): ActionValueType {
	if (AllKeysCategorized.Axis2D.JoySticks[key.Name as keyof JoySticks]) return ActionValueType.Axis2D;
	else if (AllKeysCategorized.Axis2D.MouseActions.MouseMovement.Name === key.Name as keyof MouseActions)
		return ActionValueType.Axis2D;
	else return ActionValueType.Axis1D;
}


export function CheckKeyType(key: TAllKeysCategorizedValues, value_type: ActionValueType): ActionValueType {

	switch (value_type) {
		case ActionValueType.Axis2D:
			if (AllKeysCategorized.Axis2D.JoySticks[key.Name as keyof JoySticks])
				return ActionValueType.Axis2D;

			else if (AllKeysCategorized.Axis2D.MouseActions.MouseMovement.Name === key.Name as keyof MouseActions)
				return ActionValueType.Axis2D;

			else error(" Key Given: " + key.Name + " is not a valid key for a given Type: " + value_type);
			break;


		case ActionValueType.Axis1D:
			if (AllKeysCategorized.Axis1D.JoySticks[key.Name as keyof JoySticks])
				return ActionValueType.Axis1D;

			else if (AllKeysCategorized.Axis1D.MouseActions[key.Name as keyof MouseActions])
				return ActionValueType.Axis1D;

			else error(" Key Given: " + key.Name + " is not a valid key for a given Type: " + value_type);
			break;

		case ActionValueType.Bool:
			if (AllKeysCategorized.Buttons.JoyButtons[key.Name as keyof JoyButtons]) return ActionValueType.Bool;
			else if (AllKeysCategorized.Buttons.MouseButtons[key.Name as keyof MouseButtons]) return ActionValueType.Bool;
			else if (AllKeysCategorized.Buttons.KeyboardButtons[key.Name as keyof KeyboardButtons]) return ActionValueType.Bool;
			else error(" Key Given: " + key.Name + " is not a valid key for a given Type: " + value_type);
	}

}


export function IsJoyStick(key: TAllKeysCategorizedValues): boolean {
	return AllKeysCategorized.Axis2D.JoySticks[key.Name as keyof JoySticks] ? true : false;
}

export function GetDeviceTypeFromKey(key: TAllKeysCategorizedValues): DeviceType | undefined {
	if (
		AllKeysCategorized.Axis1D.JoySticks[key.Name as keyof JoySticks] ||
		AllKeysCategorized.Buttons.JoyButtons[key.Name as keyof JoyButtons]
	) return DeviceTypeRecord.Gamepad;

	else if (AllKeysCategorized.Axis1D.MouseActions[key.Name as keyof MouseActions] ||
		AllKeysCategorized.Buttons.MouseButtons[key.Name as keyof MouseButtons] ||
		AllKeysCategorized.Buttons.KeyboardButtons[key.Name as keyof KeyboardButtons]
	) return DeviceTypeRecord.MouseKeyboard;
}
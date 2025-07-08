import { ActionValueType, Axis, EInputActions, PositionType } from "./Models/Enums";
import { Action } from "./Action";
import { InputMapping } from "./InputMapping";
import { TAllKeysCategorizedValues } from "./Models/InputTypes";
import { ActionKeyConfig, DefaultActionKeyConfig } from "./DefaultActionKeyConfigs";
import Object from "@rbxts/object-utils";

export class InputContext {

	public ActionMap: Map<EInputActions, Action> = new Map<EInputActions, Action>();

	public AddAction(name: EInputActions, shouldConsolidateValue: boolean = false): Action {
		const action = new Action(name, shouldConsolidateValue);
		this.ActionMap.set(name, action);
		return action;
	}


	public AddMappingForAction(
		name: EInputActions,
		mapping: InputMapping,
	) {
		const action = this.ActionMap.get(name);
		if (!action) {
			error(`Action ${name} does not exist`);
		}

		action.AddMapping(mapping);
	}

	public AddFromConfig(config: ActionKeyConfig = DefaultActionKeyConfig) {
		for (const [actionName, mapping] of Object.entries(config)) {

			const action = mapping.Action(actionName);
			this.ActionMap.set(actionName, action);

			for (const [key, value] of Object.entries(mapping.KeyBoardMouseMapping)) {
				action.AddMappingKeyboardMouse(value());
			}
			if (mapping.GamepadMapping) {
				for (const [key, value] of Object.entries(mapping.GamepadMapping)) {
					action.AddMappingGamepad(value());
				}
			}
		}
	}

	public ReMapActionKey(actionName: EInputActions, fromKey: TAllKeysCategorizedValues, toKey: TAllKeysCategorizedValues) {
		const action = this.ActionMap.get(actionName);
		if (!action) {
			warn(`Action ${actionName} does not exist`);
			return;
		}

		action.ReMapActionKey(fromKey, toKey);
	}
}

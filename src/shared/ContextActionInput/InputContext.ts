import { EInputActions, InputContextType } from "./Models/Enums";
import { Action } from "./Action";
import { InputMapping } from "./InputMapping";
import { TAllKeysCategorizedValues } from "./Models/InputTypes";
import { ActionKeyConfig, DefaultContextActionKeyConfig } from "./DefaultActionKeyConfigs";
import Object from "@rbxts/object-utils";
import { DeviceDetector } from "./DeviceTypeDetector";
import { DeviceType } from "./Models/types";
import { Connection } from "@rbxts/lemon-signal";

export class InputContext {

	public Name: InputContextType;
	public Assigned: boolean = false;
	public ActionMap: Map<EInputActions, Action>;
	private _currentDeviceTypeConnection?: Connection;

	constructor(name: InputContextType) {
		this.Name = name;
		this.ActionMap = new Map<EInputActions, Action>();
	}

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

	public AddFromConfig(config: ActionKeyConfig = DefaultContextActionKeyConfig[this.Name]) {
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


	public Assign() {
		this.Assigned = true;
	}

	public UnAssign() {
		this.Assigned = false;
	}


	public UpdateState(delta: number) {
		for (const [actionName, action] of this.ActionMap) {
			// print("Action: ", actionName);
			action.UpdateState(delta);
		}
	}

	public Init() {
		this._currentDeviceTypeConnection = DeviceDetector.onInputDeviceTypeChanged.Connect((deviceType: DeviceType) => {
			for (const [actionName, action] of this.ActionMap) {
				action.SetCurrentDeviceTypeContext(deviceType);
			}
		});

		for (const [actionName, action] of this.ActionMap) {
			action.Init();
		}
	}

	public Destroy() {
		this._currentDeviceTypeConnection?.Disconnect();
	}
}

import { ActionState, ActionValueType, EInputActions, TriggerState } from "./Models/Enums";
import { InputMapping } from "./InputMapping";
import { DeviceType, DeviceTypeRecord } from "./Models/types";
import { TriggerType } from "./Triggers";
import { Vector3Tools } from "./Utility/Vec3Tools";
import { TAllKeysCategorizedValues } from "./Models/InputTypes";
import { GetDeviceTypeFromKey, GetKeyMode } from "./Utility/Utility";

export class Action {
	public Name: EInputActions;
	public ActionValueType: ActionValueType = ActionValueType.Bool;
	public ShouldConsolidateValue: boolean;
	public IsReMappable: boolean = true;
	public GamepadMappings: Array<InputMapping> = [];
	public KeyboardMouseMappings: Array<InputMapping> = [];

	private Value: Vector3 = Vector3.zero;


	private _lastState: ActionState = ActionState.Completed;
	private _currentState: ActionState = ActionState.Completed;

	private _currentDeviceTypeContext: DeviceType = "MouseKeyboard";

	public SetCurrentDeviceTypeContext(deviceType: DeviceType) {
		this._currentDeviceTypeContext = deviceType;
	}


	constructor(ActionName: EInputActions, shouldConsolidateValue: boolean = false) {
		this.Name = ActionName;
		this.ShouldConsolidateValue = shouldConsolidateValue;
	}


	public AddMapping(mapping: InputMapping) {
		mapping.SetActionData(this);
		const keyType = GetDeviceTypeFromKey(mapping.Key);

		switch (keyType) {
			case DeviceTypeRecord.MouseKeyboard:
				this.KeyboardMouseMappings.push(mapping);
				break;

			case DeviceTypeRecord.Gamepad:
				this.GamepadMappings.push(mapping);
				break;
			default:
				error(`Device type ${keyType} not found`);
		}
	}

	public AddMappingKeyboardMouse(mapping: InputMapping) {
		mapping.SetActionData(this);
		this.KeyboardMouseMappings.push(mapping);
	}

	public AddMappingGamepad(mapping: InputMapping) {
		mapping.SetActionData(this);
		this.GamepadMappings.push(mapping);
	}



	public UpdateState(delta: number) {
		let ConsolidatedValue = Vector3.zero;
		let ConsolidatedTriggerState: TriggerState = TriggerState.None;

		switch (this._currentDeviceTypeContext) {
			case "MouseKeyboard":
				this.KeyboardMouseMappings.forEach((mapping) => {

					if (this.ShouldConsolidateValue) {
						ConsolidatedValue = ConsolidatedValue.add(mapping.UpdateState(delta));
					}
					else ConsolidatedValue = Vector3Tools.Max([mapping.UpdateState(delta), ConsolidatedValue]);
					const state = mapping.GetState();
					ConsolidatedTriggerState = ConsolidatedTriggerState > state ? ConsolidatedTriggerState : state;

				});
				break;


			case "Gamepad":
				this.GamepadMappings.forEach((mapping) => {

					if (this.ShouldConsolidateValue) ConsolidatedValue = ConsolidatedValue.add(mapping.UpdateState(delta));
					else ConsolidatedValue = Vector3Tools.Max([mapping.UpdateState(delta), ConsolidatedValue]);

					const state = mapping.GetState();
					ConsolidatedTriggerState = ConsolidatedTriggerState > state ? ConsolidatedTriggerState : state;
				});
				break;
		}



		if (ConsolidatedTriggerState as TriggerState === TriggerState.Triggered) {
			this._currentState = ActionState.Triggered;
			this.Value = ConsolidatedValue;
		} else if (ConsolidatedTriggerState as TriggerState === TriggerState.OnGoing) {
			this._currentState = ActionState.OnGoing;
			this.Value = Vector3.zero;
		} else {
			this._currentState = ActionState.Completed;
			this.Value = Vector3.zero;
		}

		this._lastState = this._currentState;
	}

	// public Press() { }

	// public Release() { }

	public ReMapActionKey(fromKey: TAllKeysCategorizedValues, toKey: TAllKeysCategorizedValues) {
		if (fromKey === toKey) return;

		if (!this.IsReMappable) {
			warn(`Action ${this.Name} is not re-mappable`);
			return;
		}

		switch (this._currentDeviceTypeContext) {
			case "MouseKeyboard":
				const mapping = this.KeyboardMouseMappings.find((mapping) => mapping.Key === fromKey);
				if (mapping) {
					mapping.ReMapKey(toKey);
				}
				else {
					warn(`Mapping for key ${fromKey} not found`);
				}
				break;
			case "Gamepad":
				const gamepadMapping = this.GamepadMappings.find((mapping) => mapping.Key === fromKey);
				if (gamepadMapping) {
					gamepadMapping.ReMapKey(toKey);
				}
				else {
					warn(`Mapping for key ${fromKey} not found`);
				}
				break;
			default:
				warn(`Key type ${this._currentDeviceTypeContext} not found`);
		}
	}

	public GetKeys() {
		switch (this._currentDeviceTypeContext) {
			default:
			case "MouseKeyboard":
				return this.KeyboardMouseMappings.map((mapping) => mapping.Key);

			case "Gamepad":
				return this.GamepadMappings.map((mapping) => mapping.Key);
		}
	}

	// Action Hooks

	public GetValue(): Vector3 {
		return this.Value;
	}

	public GetState(): ActionState {
		return this._currentState;
	}

	public GetLastState(): ActionState {
		return this._lastState;
	}

	public isTriggered(): boolean {
		return this._currentState === ActionState.Triggered;
	}

	public isCompleted(): boolean {
		return this._currentState === ActionState.Completed;
	}

	public isOngoing(): boolean {
		return this._currentState === ActionState.OnGoing;
	}
}

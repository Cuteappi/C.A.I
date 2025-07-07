import { ActionState, ActionValueType, EInputActions, TriggerState } from "./Models/Enums";
import { InitActionSchema, InitInputMappingSchema } from "./Models/InitActionSchema";
import { InputMapping } from "./InputMapping";
import { DeviceType } from "./Models/types";
import { TriggerType } from "./Triggers";
import { Vector3Tools } from "./Utility/Vec3Tools";

export class Action {
	public Name: EInputActions;
	public ActionValueType: ActionValueType = ActionValueType.Bool;
	public ShouldConsolidateValue: boolean;
	public IsRebindable: boolean = true;
	public GamepadMappings: Array<InputMapping<TriggerType>> = [];
	public KeyboardMouseMappings: Array<InputMapping<TriggerType>> = [];
	public Value: Vector3 = Vector3.zero;


	private _lastState: ActionState = ActionState.Completed;
	private _currentState: ActionState = ActionState.Completed;

	private _currentDeviceTypeContext: DeviceType = "MouseKeyboard";

	public SetCurrentDeviceTypeContext(deviceType: DeviceType) {
		this._currentDeviceTypeContext = deviceType;
	}


	constructor(ActionName: EInputActions, MappingContext: InitActionSchema, shouldConsolidateValue: boolean = false) {
		this.Name = ActionName;
		this.ShouldConsolidateValue = shouldConsolidateValue;
		this._InitMappings(MappingContext);
	}


	private _DecideInputMappingTriggerType<T extends TriggerType>(key: InitInputMappingSchema<T>) {
		return new InputMapping<T>(
			this.Name,
			key.Key,
			key.ActionValueType,
			key.Trigger,
			key.Axis,
			key.PositionType,
			key.Modifiers,
		);
	}

	private _InitMappings(MappingContext: InitActionSchema) {
		if (MappingContext.KeyboardMouse) {
			this.KeyboardMouseMappings = MappingContext.KeyboardMouse.map(
				(key) => this._DecideInputMappingTriggerType(key));
		}
		if (MappingContext.Gamepad) {
			this.GamepadMappings = MappingContext.Gamepad.map(
				(key) => this._DecideInputMappingTriggerType(key));
		}
	}


	UpdateState(delta: number) {
		let ConsolidatedValue = Vector3.zero;
		let ConsolidatedTriggerState: TriggerState = TriggerState.None;


		switch (this._currentDeviceTypeContext) {
			case "MouseKeyboard":
				this.KeyboardMouseMappings.forEach((mapping) => {

					let x = mapping.UpdateState(delta);
					if (this.ShouldConsolidateValue) ConsolidatedValue = ConsolidatedValue.add(x);
					else ConsolidatedValue = Vector3Tools.Max([x, ConsolidatedValue]);
					// print(x, mapping.State);

					ConsolidatedTriggerState = ConsolidatedTriggerState > mapping.State ? ConsolidatedTriggerState : mapping.State;

				});
				break;
			case "Gamepad":
				this.GamepadMappings.forEach((mapping) => {

					if (this.ShouldConsolidateValue) ConsolidatedValue = ConsolidatedValue.add(mapping.UpdateState(delta));
					else ConsolidatedValue = Vector3Tools.Max([mapping.UpdateState(delta), ConsolidatedValue]);

					ConsolidatedTriggerState = ConsolidatedTriggerState > mapping.State ? ConsolidatedTriggerState : mapping.State;
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

	public RebindKey() { }

	public GetKeys() {
		switch (this._currentDeviceTypeContext) {
			default:
			case "MouseKeyboard":
				return this.KeyboardMouseMappings.map((mapping) => mapping.Key);

			case "Gamepad":
				return this.GamepadMappings.map((mapping) => mapping.Key);
		}
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

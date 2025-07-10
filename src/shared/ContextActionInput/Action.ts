import { ActionState, ActionValueType, EInputActions, TriggerState } from "./Models/Enums";
import type { InputMapping } from "./InputMapping";
import { DeviceType } from "./Models/types";
import { Vector3Tools } from "./Utility/Vec3Tools";
import { TAllKeysCategorizedValues } from "./Models/InputTypes";
import { GetDeviceTypeFromKey } from "./Utility/Utility";
import Object from "@rbxts/object-utils";

export class Action {
	public Name: EInputActions;
	public ActionValueType: ActionValueType = ActionValueType.Bool;
	public ShouldConsolidateValue: boolean;
	public IsReMappable: boolean = true;
	public Mappings: Array<InputMapping> = [];

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
		this.Mappings.push(mapping);
	}

	private getActiveDeviceMappings(): InputMapping[] {
		const deviceType = this._currentDeviceTypeContext;
		return this.Mappings.filter((mapping) => GetDeviceTypeFromKey(mapping.Key) === deviceType);
	}

	private _getConsolidatedState(mappings: InputMapping[], delta: number): LuaTuple<[Vector3, TriggerState]> {
		let ConsolidatedValue = Vector3.zero;
		let ConsolidatedTriggerState: TriggerState = TriggerState.None;

		mappings.forEach((mapping) => {
			if (this.ShouldConsolidateValue) {
				ConsolidatedValue = ConsolidatedValue.add(mapping.UpdateState(delta));
			} else ConsolidatedValue = Vector3Tools.Max([mapping.UpdateState(delta), ConsolidatedValue]);
			const state = mapping.GetState();
			ConsolidatedTriggerState = ConsolidatedTriggerState > state ? ConsolidatedTriggerState : state;
		});

		return $tuple(ConsolidatedValue, ConsolidatedTriggerState);
	}

	public UpdateState(delta: number) {
		const activeMappings = this.getActiveDeviceMappings();
		const [ConsolidatedValue, ConsolidatedTriggerState] = this._getConsolidatedState(activeMappings, delta);

		if (ConsolidatedTriggerState === TriggerState.Triggered) {
			this._currentState = ActionState.Triggered;
			this.Value = ConsolidatedValue;
		} else if (ConsolidatedTriggerState === TriggerState.OnGoing) {
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


		const activeMappings = this.getActiveDeviceMappings();
		const mapping = activeMappings.find((m) => m.Key === fromKey);

		if (mapping) {
			mapping.ReMapKey(toKey);
		} else {
			warn(`Mapping for key ${fromKey} not found on the current device`);
		}

	}

	public ActivateInputMappings() {
		const deviceType = this._currentDeviceTypeContext;
		this.Mappings.forEach((mapping) => {
			if (GetDeviceTypeFromKey(mapping.Key) === deviceType) {
				mapping.ActivateKey();
			}
		});
	}

	public DeactivateInputMappings() {
		const deviceType = this._currentDeviceTypeContext;
		this.Mappings.forEach((mapping) => {
			if (GetDeviceTypeFromKey(mapping.Key) === deviceType) {
				mapping.DeactivateKey();
			}
		});
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

	public IsTriggered(): boolean {
		return this._currentState === ActionState.Triggered;
	}

	public IsCompleted(): boolean {
		return this._currentState === ActionState.Completed;
	}

	public IsOngoing(): boolean {
		return this._currentState === ActionState.OnGoing;
	}


	private ValidateActionInitialization() {
		if (this.Mappings.size() === 0) {
			error(`No mappings found for action ${this.Name}`);
		}
	}

	// Init
	public Init() {

		const duplicateKeys = new Set<TAllKeysCategorizedValues>();
		const allKeys = new Set<TAllKeysCategorizedValues>();

		this.Mappings.forEach((mapping) => {
			if (allKeys.has(mapping.Key)) {
				duplicateKeys.add(mapping.Key);
			}
			allKeys.add(mapping.Key);
		});

		if (duplicateKeys.size() > 0) {
			error(`Duplicate keys found for action ${this.Name}: ${Object.values(duplicateKeys).join(", ")}`);
		}

		this.ValidateActionInitialization();

		this.Mappings.forEach((mapping) => mapping.ValidateInputMappingInitialization());

	}
}

import { CheckKeyType } from "./Utility/Utility";
import { AddModifiers, compose, ModifierArray, ModifierFactories, ModifierFunction, Mods } from "./Modifiers";
import { TriggerState, ActionValueType, PositionType, Axis, EInputActions } from "./Models/Enums";
import { AllKeysCategorized, TAllKeysCategorizedValues } from "./Models/InputTypes";
import { InputManager } from "./InputManager/InputManager";
import { RawInputData } from "./InputManager/RawInputData";
import {
	BaseTrigger,
	TriggerType,
	TriggerConfigs,
	DEFAULT_TRIGGER_CONFIGS,
} from "./Triggers";
import { TriggerFactory } from "./Triggers/TriggerFactory";


type Action = import("./Action").Action;


export class InputMapping {
	public Action!: Action;
	public Name!: string;

	// changeable values
	public Key: TAllKeysCategorizedValues;

	// Settable values
	private ActionValueType!: ActionValueType;
	private Axis: Axis;
	private PositionType: PositionType;
	private Modifiers: ModifierFunction[];
	private Trigger!: BaseTrigger;
	private IsRemappable: boolean = false;


	public _triggerState: TriggerState = TriggerState.None;

	private _value: Vector3 = Vector3.zero;
	private _lastValue: Vector3 = Vector3.zero;

	constructor(key: TAllKeysCategorizedValues, config: { actionValueType?: ActionValueType, name?: string; } = {}) {
		this.Key = key;
		this.ActionValueType = config.actionValueType ?? ActionValueType.Bool;
		CheckKeyType(this.Key, this.ActionValueType);
		// InputManager.AddActiveKey(key);

		this.Name = config.name ?? "";
		this.PositionType = PositionType.Position;
		this.Modifiers = [];
		this.SetTrigger("DownTrigger");
		this.Axis = Axis.X;
	}


	// Setters

	public SetTrigger<T extends TriggerType>(
		trigger: T,
		config: TriggerConfigs[T] = DEFAULT_TRIGGER_CONFIGS[trigger],
	): InputMapping {
		this.Trigger = TriggerFactory.create(trigger, this.ActionValueType, config);
		return this;
	}

	public SetModifiers(...modifiers: ModifierArray<keyof ModifierFactories>[]): InputMapping {
		this.Modifiers = AddModifiers(...modifiers);
		return this;
	}

	public SetAxis(axis: Axis): InputMapping {
		this.Axis = axis;
		return this;
	}

	public SetPositionType(positionType: PositionType): InputMapping {
		this.PositionType = positionType;
		return this;
	}

	public SetActionValueType(actionValueType: ActionValueType): InputMapping {
		this.ActionValueType = actionValueType;
		CheckKeyType(this.Key, this.ActionValueType);
		return this;
	}

	public SetIsRemappable(isRemappable: boolean): InputMapping {
		this.IsRemappable = isRemappable;
		return this;
	}

	public SetActionData(action: Action): InputMapping {
		this.Action = action;
		this.IsRemappable = action.IsReMappable;
		return this;
	}

	public SetName(name: string): InputMapping {
		this.Name = name;
		return this;
	}


	//Getters

	public GetState(): TriggerState {
		return this._triggerState;
	}

	public GetValue(): Vector3 {
		return this._value;
	}

	// functions regarding input Remapping
	public ReMapKey(key: TAllKeysCategorizedValues): void {
		if (InputManager.ReMapKey(this.Key, key)) {
			this.Key = key;
			return;
		}
		warn(`There was aproblem remapping ${this.Name}`);
		return;
	}

	public ActivateKey(): void {
		InputManager.AddActiveKey(this.Key);
	}

	public DeactivateKey(): void {
		InputManager.RemoveActiveKey(this.Key);
	}

	// functions to process input below


	private _handle1DInput(keydata: RawInputData): Vector3 {
		switch (this.PositionType) {
			case PositionType.Position:
				//check for if its mouse wheel position
				if (this.Key === AllKeysCategorized.Axis1D.MouseActions.MouseWheel) {
					if (keydata.KeyBuffer.Current) return new Vector3(keydata.Position.Z, 0, 0);
					else return Vector3.zero;
				}

				switch (this.Axis) {
					case Axis.X:
						return new Vector3(keydata.Position.X, 0, 0);
					case Axis.Y:
						return new Vector3(0, keydata.Position.Y, 0);
					default:
						return new Vector3(keydata.Position.X, 0, 0);
				}

			case PositionType.Delta:
				switch (this.Axis) {
					case Axis.X:
						return new Vector3(keydata.Delta.X, 0, 0);
					case Axis.Y:
						return new Vector3(0, keydata.Delta.Y, 0);
					default:
						return new Vector3(keydata.Delta.X, 0, 0);
				}
		}
	}

	private _handle2DInput(keydata: RawInputData): Vector3 {
		switch (this.PositionType) {
			case PositionType.Position:
				// print("Position: ", keydata.Position);
				return keydata.Position;
			case PositionType.Delta:
				return keydata.Delta;
		}
	}

	private _processInput(): Vector3 {
		const KeyData = InputManager.activeKeys.get(this.Key);
		if (!KeyData) {
			warn("KeyData not found for key: " + this.Key);
			return Vector3.zero;
		}

		// print(this.Key.Name, ": ", KeyData.KeyBuffer.Current);

		switch (this.ActionValueType) {
			case ActionValueType.Bool:
				return KeyData.KeyBuffer.Current ? new Vector3(1, 0, 0) : new Vector3(0, 0, 0);

			case ActionValueType.Axis1D:
				return this._handle1DInput(KeyData);

			case ActionValueType.Axis2D:
				return this._handle2DInput(KeyData);
		}
	}

	public UpdateState(delta: number): Vector3 {
		this._value = this._processInput();

		this._value = compose(...this.Modifiers)(this._value);
		// print("mappingValue: ", this._value);

		this._triggerState = this.Trigger.UpdateState(this._value, this._lastValue, delta);
		// print(this.Key.Name, ": ", this._value);

		//Update Last Value
		this._lastValue = this._value;

		return this._value;
	}



	public ValidateInputMappingInitialization() {
		if (this.Trigger === undefined) {
			warn("Trigger not initialized for key: " + this.Key);
		}
		if (this.Action === undefined) {
			warn("Action not initialized for key: " + this.Key);
		}
		if (this.ActionValueType === undefined) {
			warn("ActionValueType not initialized for key: " + this.Key);
		}
		if (this.Modifiers === undefined) {
			warn("Modifiers not initialized for key: " + this.Key);
		}
		if (this.IsRemappable === undefined) {
			warn("IsRemappable not initialized for key: " + this.Key);
		}
	}
}

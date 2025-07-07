import { CheckKeyType } from "./Utility/Utility";
import { compose, ModifierFactories, ModifierFunction, Mods } from "./Modifiers";
import { TriggerState, ActionValueType, PositionType, Axis, EInputActions } from "./Models/Enums";
import { AllKeysCategorized, TAllKeysCategorizedValues } from "./Models/InputTypes";
import { InputManager } from "./InputManager/InputManager";
import { RawInputData } from "./InputManager/RawInputData";
import {
	BaseTrigger,
	TriggerType,
	TriggerSchema,
	HoldTrigger,
	PressedTrigger,
	PulseTrigger,
	ReleasedTrigger,
	DownTrigger,
	TriggerConfigs,
	DEFAULT_TRIGGER_CONFIGS,
} from "./Triggers";


export class InputMapping<T extends TriggerType = "DownTrigger"> {
	public Key: TAllKeysCategorizedValues;
	public ActionValueType: ActionValueType;
	public Axis: Axis;
	public PositionType: PositionType;
	public Modifiers: ModifierFunction[];
	public Trigger: BaseTrigger;
	public Action: EInputActions;


	public State: TriggerState = TriggerState.None;
	public IsRemappable: boolean = false;

	private _value: Vector3 = Vector3.zero;
	private _lastValue: Vector3 = Vector3.zero;

	constructor(
		action: EInputActions,
		key: TAllKeysCategorizedValues,
		actionValueType: ActionValueType,
		trigger: TriggerSchema<T>,
		axis: Axis = Axis.X,
		positionType: PositionType = PositionType.Position,
		modifiers: ModifierFunction[] = [],
	) {
		this.Action = action;
		this.Key = key;
		this.ActionValueType = actionValueType;

		CheckKeyType(key, this.ActionValueType);
		InputManager.AddActiveKey(key);

		this.PositionType = positionType;
		this.Modifiers = modifiers;
		this.Trigger = this.GetTrigger(trigger.Type, trigger.config ?? DEFAULT_TRIGGER_CONFIGS[trigger.Type]);
		this.Axis = axis;
	}

	private Handle1DInput(keydata: RawInputData): Vector3 {
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

	private Handle2DInput(keydata: RawInputData): Vector3 {
		switch (this.PositionType) {
			case PositionType.Position:
				// print("Position: ", keydata.Position);
				return keydata.Position;
			case PositionType.Delta:
				return keydata.Delta;
		}
	}

	private ProcessInput(): Vector3 {
		const KeyData = InputManager.activeKeys.get(this.Key);
		if (!KeyData) {
			warn("KeyData not found for key: " + this.Key);
			return Vector3.zero;
		}

		switch (this.ActionValueType) {
			case ActionValueType.Bool:
				return KeyData.KeyBuffer.Current ? new Vector3(1, 0, 0) : new Vector3(0, 0, 0);

			case ActionValueType.Axis1D:
				return this.Handle1DInput(KeyData);

			case ActionValueType.Axis2D:
				return this.Handle2DInput(KeyData);
		}
	}

	public UpdateState(delta: number): Vector3 {
		this._value = this.ProcessInput();

		this._value = compose(...this.Modifiers)(this._value);
		// print("mappingValue: ", this._value);

		this.State = this.Trigger.UpdateState(this._value, this._lastValue, delta);

		//Update Last Value
		this._lastValue = this._value;

		return this._value;
	}

	private GetTrigger<T extends TriggerType>(trigger: T, config: TriggerConfigs[T]): BaseTrigger {


		switch (trigger) {
			case "DownTrigger":
				return new DownTrigger(this.ActionValueType);
			case "PressedTrigger":
				return new PressedTrigger(this.ActionValueType);



			case "HoldTrigger": {
				const holdConfig = config as TriggerConfigs["HoldTrigger"];
				print(holdConfig.isOneShot);
				return new HoldTrigger(
					this.ActionValueType,
					holdConfig.holdTime ?? DEFAULT_TRIGGER_CONFIGS.HoldTrigger.holdTime,
					holdConfig.isOneShot ?? DEFAULT_TRIGGER_CONFIGS.HoldTrigger.isOneShot,
				);
			}


			case "PulseTrigger": {
				const pulseConfig = config as TriggerConfigs["PulseTrigger"];
				return new PulseTrigger(
					this.ActionValueType,
					pulseConfig.triggerOnStart ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.triggerOnStart,
					pulseConfig.initialDelay ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.initialDelay,
					pulseConfig.pulseInterval ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.pulseInterval,
					pulseConfig.maxPulses ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.maxPulses,
				);
			}


			case "ReleasedTrigger":
				return new ReleasedTrigger(this.ActionValueType);

			// TODO create Combo and Chorded Triggers
			case "ChordedTrigger":
				return new DownTrigger(this.ActionValueType);
			case "ComboTrigger":
				return new DownTrigger(this.ActionValueType);
			default:
				return new DownTrigger(this.ActionValueType);
		}
	}

	public ChangeTrigger<T extends TriggerType>(trigger: T, config: TriggerConfigs[T] = DEFAULT_TRIGGER_CONFIGS[trigger]): void {
		this.Trigger = this.GetTrigger(trigger, config);
	}
}

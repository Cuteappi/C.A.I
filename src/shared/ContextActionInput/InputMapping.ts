import { CheckKeyType } from "./Utility";
import { compose, ModifierFactories, ModifierFunction, Mods } from "./Modifiers";
import { TriggerState, ActionValueType, PositionType, Axis } from "./Enums";
import { AllKeysCategorized, TAllKeysCategorizedValues } from "./InputTypes";
import { InputManager } from "./InputManager";
import { RawInputData } from "./RawInputData";
import {
	BaseTrigger,
	TriggerType,
	HoldTrigger,
	PressedTrigger,
	PulseTrigger,
	ReleasedTrigger,
	DownTrigger,
	TriggerConfigs,
	DEFAULT_TRIGGER_CONFIGS,
} from "./Triggers";

export type ModifierArray<T extends keyof ModifierFactories> = {
	modifier: T;
	settings?: Parameters<ModifierFactories[T]>[0];
};

export class InputMapping {
	public IsRemappable: boolean = false;
	public State: TriggerState = TriggerState.None;
	public Trigger: BaseTrigger;
	public Modifiers: ModifierFunction[];
	public Value: Vector3 = Vector3.zero;
	private _LastValue: Vector3 = Vector3.zero;
	public PositionType: PositionType;
	public ActionValueType: ActionValueType;
	public Key: TAllKeysCategorizedValues;
	public Axis: Axis;

	constructor(
		key: TAllKeysCategorizedValues,
		actionValueType: ActionValueType,
		axis: Axis = Axis.X,
		positionType: PositionType = PositionType.Position,
		modifiers: ModifierFunction[] = [],
		trigger: TriggerType = "DownTrigger",
	) {
		this.Key = key;
		this.ActionValueType = actionValueType;

		CheckKeyType(key, this.ActionValueType);

		this.PositionType = positionType;
		this.Modifiers = modifiers;
		this.Trigger = this.GetTrigger(trigger, DEFAULT_TRIGGER_CONFIGS[trigger]);
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
			warn("KeyData not found");
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
		this.Value = this.ProcessInput();

		this.Value = compose(...this.Modifiers)(this.Value);

		this.State = this.Trigger.UpdateState(this.Value, this._LastValue, delta);

		//Update Last Value
		this._LastValue = this.Value;

		return this.Value;
	}

	public AddModifiers(...modifiers: ModifierArray<keyof ModifierFactories>[]): void {
		for (const modifier of modifiers) {
			this.Modifiers.push(Mods.Add(modifier.modifier, modifier.settings));
		}
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

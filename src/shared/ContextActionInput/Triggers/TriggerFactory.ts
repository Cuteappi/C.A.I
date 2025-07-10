import { ActionValueType } from "../Models/Enums";
import {
	BaseTrigger,
	DownTrigger,
	HoldTrigger,
	PressedTrigger,
	PulseTrigger,
	ReleasedTrigger,
	TriggerConfigs,
	TriggerType,
	DEFAULT_TRIGGER_CONFIGS,
} from ".";

type TriggerCreator = (actionValueType: ActionValueType, config: TriggerConfigs[TriggerType]) => BaseTrigger;

const triggerRegistry = new Map<TriggerType, TriggerCreator>();

function registerTrigger<T extends TriggerType>(
	name: T,
	creator: (actionValueType: ActionValueType, config: TriggerConfigs[T]) => BaseTrigger,
) {
	triggerRegistry.set(name, creator as TriggerCreator);
}

// Register all the existing triggers
registerTrigger("DownTrigger", (actionValueType) => new DownTrigger(actionValueType));
registerTrigger("PressedTrigger", (actionValueType) => new PressedTrigger(actionValueType));
registerTrigger("ReleasedTrigger", (actionValueType) => new ReleasedTrigger(actionValueType));

registerTrigger(
	"HoldTrigger",
	(actionValueType, config) =>
		new HoldTrigger(
			actionValueType,
			config.holdTime ?? DEFAULT_TRIGGER_CONFIGS.HoldTrigger.holdTime,
			config.isOneShot ?? DEFAULT_TRIGGER_CONFIGS.HoldTrigger.isOneShot,
		),
);

registerTrigger(
	"PulseTrigger",
	(actionValueType, config) =>
		new PulseTrigger(
			actionValueType,
			config.triggerOnStart ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.triggerOnStart,
			config.initialDelay ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.initialDelay,
			config.pulseInterval ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.pulseInterval,
			config.maxPulses ?? DEFAULT_TRIGGER_CONFIGS.PulseTrigger.maxPulses,
		),
);

// TODO: Implement these triggers fully
// registerTrigger("ChordedTrigger", (actionValueType) => new DownTrigger(actionValueType));
// registerTrigger("ComboTrigger", (actionValueType) => new DownTrigger(actionValueType));

export namespace TriggerFactory {
	export function create<T extends TriggerType>(
		triggerType: T,
		actionValueType: ActionValueType,
		config: TriggerConfigs[T],
	): BaseTrigger {
		const creator = triggerRegistry.get(triggerType);
		if (!creator) {
			warn(`Trigger type "${triggerType}" is not registered. Falling back to DownTrigger.`);
			return new DownTrigger(actionValueType);
		}
		return creator(actionValueType, config);
	}
}

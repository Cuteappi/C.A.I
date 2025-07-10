import { DownTrigger } from "./DownTrigger";
import { PressedTrigger } from "./PressedTrigger";
import { HoldTrigger } from "./HoldTrigger";
import { PulseTrigger } from "./PulseTrigger";
import { ReleasedTrigger } from "./ReleasedTrigger";
import { ChordedTrigger } from "./ChordedTrigger";
import { ComboTrigger } from "./ComboTrigger";
import { BaseTrigger } from "./BaseTrigger";


type Triggers = {
    DownTrigger: DownTrigger;
    PressedTrigger: PressedTrigger;
    HoldTrigger: HoldTrigger;
    PulseTrigger: PulseTrigger;
    ReleasedTrigger: ReleasedTrigger;
    // ChordedTrigger: ChordedTrigger;
    // ComboTrigger: ComboTrigger;
};

export type TriggerType = keyof Triggers;

export type TriggerConfigs = {
    DownTrigger: undefined;
    PressedTrigger: undefined;
    HoldTrigger: { holdTime?: number; isOneShot?: boolean; };
    PulseTrigger: { triggerOnStart?: boolean; initialDelay?: number; pulseInterval?: number; maxPulses?: number; };
    ReleasedTrigger: undefined;
    // ChordedTrigger: undefined;
    // ComboTrigger: undefined;
};

export type TriggerSchema<T extends TriggerType = "DownTrigger"> = {
    Type: T;
} & (keyof TriggerConfigs[T] extends never
    ? { config?: TriggerConfigs[T]; }
    : { config: TriggerConfigs[T]; });


export const DEFAULT_TRIGGER_CONFIGS: TriggerConfigs = {
    DownTrigger: undefined,
    PressedTrigger: undefined,
    HoldTrigger: { holdTime: 1, isOneShot: false },
    PulseTrigger: { triggerOnStart: true, initialDelay: 0.3, pulseInterval: 0.1, maxPulses: 0 },
    ReleasedTrigger: undefined,
    // ChordedTrigger: undefined,
    // ComboTrigger: undefined,
};


export {
    BaseTrigger,
    DownTrigger,
    PressedTrigger,
    HoldTrigger,
    PulseTrigger,
    ReleasedTrigger,
    // ChordedTrigger,
    // ComboTrigger
};
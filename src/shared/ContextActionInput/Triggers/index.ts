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
    ChordedTrigger: ChordedTrigger;
    ComboTrigger: ComboTrigger;
};

export type TriggerType = keyof Triggers;

export type TriggerConfigs = {
    DownTrigger: {};
    PressedTrigger: {};
    HoldTrigger: { holdTime?: number; isOneShot?: boolean; };
    PulseTrigger: { triggerOnStart?: boolean; initialDelay?: number; pulseInterval?: number; maxPulses?: number; };
    ReleasedTrigger: {};
    ChordedTrigger: {};
    ComboTrigger: {};
};

export const DEFAULT_TRIGGER_CONFIGS: TriggerConfigs = {
    DownTrigger: {},
    PressedTrigger: {},
    HoldTrigger: { holdTime: 1, isOneShot: false },
    PulseTrigger: { triggerOnStart: true, initialDelay: 0.3, pulseInterval: 0.1, maxPulses: 0 },
    ReleasedTrigger: {},
    ChordedTrigger: {},
    ComboTrigger: {},
};


export {
    BaseTrigger,
    DownTrigger,
    PressedTrigger,
    HoldTrigger,
    PulseTrigger,
    ReleasedTrigger,
    ChordedTrigger,
    ComboTrigger
};
import { BaseTrigger } from "./BaseTrigger";
import { ActionValueType, TriggerState } from "../Models/Enums";

export class PulseTrigger extends BaseTrigger {
    private _TriggerOnStart: boolean;
    private _InitialDelay: number;
    private _PulseInterval: number;
    private _MaxPulses: number;

    private _delayUntilNextPulse = 0;
    private _emittedPulses = 0;

    constructor(
        actionValueType: ActionValueType,
        triggerOnStart = true,
        initialDelay = 0.3,
        pulseInterval = 0.1,
        maxPulses = 0,
    ) {
        super(actionValueType);
        this._TriggerOnStart = triggerOnStart;
        this._InitialDelay = initialDelay;
        this._PulseInterval = pulseInterval;
        this._MaxPulses = maxPulses;
    }

    public UpdateState(currentInput: Vector3, lastInput: Vector3, delta: number): TriggerState {
        const isCurrentlyPressed = this.isActuated(currentInput);
        const wasPreviouslyPressed = this.isActuated(lastInput);

        if (isCurrentlyPressed) {
            if (!wasPreviouslyPressed) {
                // Initial press
                this._emittedPulses = 0;
                this._delayUntilNextPulse = this._InitialDelay;
                if (this._TriggerOnStart) {
                    if (this._MaxPulses > 0) {
                        this._emittedPulses++;
                    }
                    return TriggerState.Triggered; // Return immediately
                }
            }

            // Check if we've already emitted max pulses
            if (this._MaxPulses > 0 && this._emittedPulses >= this._MaxPulses) {
                return TriggerState.None;
            }

            // Update timer
            this._delayUntilNextPulse -= delta;

            if (this._delayUntilNextPulse > 0) {
                return TriggerState.OnGoing;
            }

            // Time to pulse
            this._delayUntilNextPulse += this._PulseInterval; // Reset for next pulse
            if (this._MaxPulses > 0) {
                this._emittedPulses++;
            }
            return TriggerState.Triggered;
        } else {
            // Not pressed, reset
            this._emittedPulses = 0;
            this._delayUntilNextPulse = 0;
            return TriggerState.None;
        }
    }

    private isActuated(input: Vector3): boolean {
        switch (this.ActionValueType) {
            case ActionValueType.Bool:
            case ActionValueType.Axis1D:
                return math.abs(input.X) > 0;
            case ActionValueType.Axis2D:
                return math.abs(input.X) > 0 || math.abs(input.Y) > 0;
            default:
                return false;
        }
    }
}

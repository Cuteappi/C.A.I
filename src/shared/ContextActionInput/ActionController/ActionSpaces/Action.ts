// import Signal from "@rbxts/lemon-signal";
// import { EInputActions } from "../../Enums";
// // import { InputManager } from "../../InputManager";
// import { ModifierFunction, Modifiers } from "../../Modifiers";
// import { Trigger, TriggerType } from "../../Triggers";
// import {
//     ActionModifiers,
//     GamepadActionSpaceKeycodes,
//     KeyboardMouseActionSpaceKeycodes,
// } from "../types";

// export abstract class Action {
//     public readonly name: EInputActions;
//     public readonly triggers: Trigger[];
//     public readonly onFired = new Signal<(value?: Vector3) => void>();

//     public actionValue: Vector3 = Vector3.zero;
//     public keyCodes?: {
//         KeyboardMouse?: KeyboardMouseActionSpaceKeycodes;
//         Gamepad?: GamepadActionSpaceKeycodes;
//     };
//     public modifiers?: ActionModifiers;

//     // State for triggers
//     public isPressed = false;
//     public pressStartTime = 0;
//     public lastPulseTime = 0;
//     public wasHoldFired = false;

//     constructor(name: EInputActions, triggers: Trigger[], modifiers?: ActionModifiers) {
//         this.name = name;
//         this.triggers = triggers;
//         this.modifiers = modifiers;
//     }

//     /**
//      * Processes the raw input from ContextActionService and updates the trigger state machines.
//      * This method will be called by the InputManager.
//      */
//     public processInput(actionName: string, state: Enum.UserInputState, inputObject: InputObject) {
//         const now = os.clock();

//         // Update base state & action value
//         if (state === Enum.UserInputState.Begin) {
//             this.isPressed = true;
//             this.pressStartTime = now;
//             this.wasHoldFired = false; // Reset on new press
//             this.actionValue = new Vector3(1, 0, 0); // For boolean, indicates "on"
//         } else if (state === Enum.UserInputState.Change) {
//             this.actionValue = inputObject.Position; // For analog inputs
//         } else if (state === Enum.UserInputState.End || state === Enum.UserInputState.Cancel) {
//             this.isPressed = false;
//             this.actionValue = Vector3.zero; // Indicates "off"
//         }

//         // Process instantaneous triggers that depend on input state changes
//         for (const trigger of this.triggers) {
//             // Handle actuation threshold for analog inputs
//             if (
//                 trigger.actuationThreshold !== undefined
//                 && this.actionValue.Magnitude < trigger.actuationThreshold
//             ) {
//                 continue; // Skip if below threshold
//             }

//             switch (trigger.type) {
//                 case TriggerType.Pressed:
//                     if (state === Enum.UserInputState.Begin) {
//                         this.onFired.Fire(this.actionValue);
//                     }
//                     break;
//                 case TriggerType.Released:
//                     if (state === Enum.UserInputState.End) {
//                         this.onFired.Fire(this.actionValue);
//                     }
//                     break;
//                 case TriggerType.Tap:
//                     if (state === Enum.UserInputState.End) {
//                         if (now - this.pressStartTime <= trigger.tapThreshold) {
//                             this.onFired.Fire(this.actionValue);
//                         }
//                     }
//                     break;
//             }
//         }
//     }

//     /**
//      * Processes time-based triggers. This method should be called every frame.
//      */
//     public update(deltaTime: number) {
//         if (!this.isPressed) {
//             return;
//         }

//         const now = os.clock();

//         for (const trigger of this.triggers) {
//             if (
//                 trigger.actuationThreshold !== undefined
//                 && this.actionValue.Magnitude < trigger.actuationThreshold
//             ) {
//                 continue;
//             }

//             switch (trigger.type) {
//                 default: // down
//                     this.onFired.Fire(this.actionValue);
//                     break;
//                 case TriggerType.Hold:
//                     if (!this.wasHoldFired && now - this.pressStartTime >= trigger.holdTime) {
//                         this.wasHoldFired = true;
//                         this.onFired.Fire(this.actionValue);
//                     }
//                     break;
//                 case TriggerType.Pulse: {
//                     // Handle initial pulse delay
//                     const firstPulseTime = trigger.waitForFirstPulse
//                         ? this.pressStartTime + trigger.interval
//                         : this.pressStartTime;

//                     if (now >= firstPulseTime && now - this.lastPulseTime >= trigger.interval) {
//                         this.lastPulseTime = now;
//                         this.onFired.Fire(this.actionValue);
//                     }
//                     break;
//                 }
//             }
//         }
//     }
// }

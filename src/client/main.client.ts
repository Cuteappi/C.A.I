import { ContextActionService, Players } from "@rbxts/services";
import { TestInputMapping, TestAction, TestRemap, TestCAI } from "./Test/InputManagerTest";
import { DeviceDetector } from "shared/ContextActionInput/DeviceTypeDetector";
import { run } from "./SampleUI/App";

run();
import { InputManager } from "shared/ContextActionInput/InputManager/InputManager";
import { TouchInputManager } from "shared/ContextActionInput/InputManager/TouchInputManager";


// TestInputMapping();
DeviceDetector.Init();
TouchInputManager.Init();
// InputManager.Init();
// TestAction();
// TestRemap();

// TestCAI();

// ContextActionService.BindActionAtPriority(
//     "Touch test",
//     (actionName: string, state: Enum.UserInputState, inputObject: InputObject) => {
//         if (state === Enum.UserInputState.Change) {
//             if (inputObject.UserInputType === Enum.UserInputType.Touch) {
//                 print(inputObject.Position);
//             }
//         }
//     },
//     false,
//     1,
//     Enum.UserInputType.Touch
// )




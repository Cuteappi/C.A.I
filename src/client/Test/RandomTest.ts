import Object from "@rbxts/object-utils";
import { ContextActionService, UserInputService } from "@rbxts/services";

// function onMouseButton1Pressed(
//     actionName: string,
//     inputState: Enum.UserInputState,
//     inputObject: InputObject,
// ) {
//     if (inputState === Enum.UserInputState.Begin) {
//         print("Pressed");
//     } else if (inputState === Enum.UserInputState.Change) {
//         print("position: ", inputObject.Position);
//         print("delta: ", inputObject.Delta);
//     } else if (inputState === Enum.UserInputState.End) {
//         print("Released");
//     }
// }

// ContextActionService.BindAction(
//     "MouseButton1Action", // Action name
//     onMouseButton1Pressed, // Function to call
//     false, // Create a UI button? (false for mouse input)
//     ...Object.values([InputKeyCodes.MouseRest.MouseWheel, InputKeyCodes.MouseRest.MouseMovement]), // Input type
// );

// class Test {
//     Name: string = "yes";
// }
// const test = new Test();
// const thread = coroutine.wrap(() => {
//     task.wait(2);
//     test.Name = "no";
//     print(test.Name);
// });

// const mouseLock = false;

// ContextActionService.BindAction(
// 	"Mouselock", // Action name
// 	(actionName: string, inputState: Enum.UserInputState, inputObject: InputObject) => {
// 		if (inputState === Enum.UserInputState.Begin) {
// 			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition;
// 			mouseLock = !mouseLock;
// 		}
// 	},
// 	false,
// 	InputKeyCodes.Keys.Q,
// );

// ContextActionService.BindAction(
// 	"Test", // Action name
// 	(actionName: string, inputState: Enum.UserInputState, inputObject: InputObject) => {
// 		if (inputState === Enum.UserInputState.Begin) {
// 			if (inputObject.KeyCode === Enum.KeyCode.A) {
// 				thread();
// 				print("Pressed");
// 			}
// 		} else if (inputState === Enum.UserInputState.End) {
// 			if (inputObject.KeyCode === Enum.KeyCode.A) {
// 				print("Released");
// 			}
// 		}
// 	}, // Function to call
// 	false, // Create a UI button? (false for mouse input)
// 	Enum.KeyCode.A, // Input type
// );

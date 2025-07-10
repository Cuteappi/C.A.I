import { ContextActionService, Players } from "@rbxts/services";
import { TestInputMapping, TestAction, TestRemap, TestCAI } from "./Test/InputManagerTest";
import { DeviceDetector } from "shared/ContextActionInput/DeviceTypeDetector";
import { InputManager } from "shared/ContextActionInput/InputManager/InputManager";


// TestInputMapping();
DeviceDetector.Init();
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

// Get the LocalPlayer
const localPlayer = Players.LocalPlayer;

// Create a ScreenGui to hold the button
const screenGui = new Instance("ScreenGui");
screenGui.Name = "TouchGui";
screenGui.Parent = localPlayer.WaitForChild("PlayerGui");



const frame = new Instance("Frame");
frame.Size = new UDim2(0, 400, 0, 100);
frame.Position = new UDim2(0.5, -100, 0.5, -25);
frame.BackgroundColor3 = Color3.fromRGB(255, 255, 0); // Center the button
frame.Name = "TouchGui2";
frame.Parent = screenGui;

// Create a TextButton
const touchButton = new Instance("TextButton");
touchButton.Name = "TouchButton";
touchButton.Text = "Touch Me";
touchButton.Size = new UDim2(0, 200, 0, 50);
touchButton.Position = new UDim2(0.5, -100, 0.5, -25); // Center the button
touchButton.Parent = frame;

let io: InputObject;


touchButton.InputBegan.Connect((input) => {
    io = input;
});
// Connect to the InputBegan event
touchButton.InputChanged.Connect((input) => {
    if (io === input) print(true);

    if (input.UserInputType === Enum.UserInputType.Touch) {
        print("GUI touched at: " + input.Position);
        // Add your code to run on touch here
    }


});

frame.InputChanged.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.Touch) {
        print("Frame touched at: " + input.Position);
    }
});

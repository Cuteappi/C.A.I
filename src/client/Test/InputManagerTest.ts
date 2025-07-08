import { AddModifiers, compose, Mods } from "../../shared/ContextActionInput/Modifiers";
import { InputMapping } from "shared/ContextActionInput/InputMapping";
import { InputManager } from "shared/ContextActionInput/InputManager/InputManager";
import { GamepadService, RunService } from "@rbxts/services";
import { ActionValueType, PositionType, Axis, EGameplayInputActions } from "shared/ContextActionInput/Models/Enums";
import { DeviceTypeRecord, DeviceType } from "shared/ContextActionInput/Models/types";
import { DeviceDetector } from "shared/ContextActionInput/DeviceTypeDetector";
import { ActionCreationApi } from "shared/ContextActionInput/CreationApi";

function process(delta: number, inputMapping: InputMapping) {
    debug.profilebegin("Test InputMapping for values");
    inputMapping.UpdateState(delta);
    debug.profileend();
}


export function InitTest() { InputManager.InitTest(); }

export function TestCompose() {
    const negateAndNormalize = compose(
        Mods.Negate({ X: true, Y: true, Z: true }),
    );

    const initialValue = new Vector3(5, 0, 0);
    const result = negateAndNormalize(initialValue);
    print(`Compose Test: Initial: ${initialValue}, Result: ${result}`);

}

export function TestInputMapping() {

    GamepadService.DisableGamepadCursor();

    const key = Enum.UserInputType.MouseButton1;
    InputManager.AddActiveKey(key);
    print(InputManager.activeKeys);
    // const inputMapping = new InputMapping<"PressedTrigger">(
    //     EGameplayInputActions.Move,
    //     key,
    //     ActionValueType.Bool,
    //     { Type: "PressedTrigger" },
    // );
    // // inputMapping.ChangeTrigger("ReleasedTrigger");
    // // inputMapping.AddModifiers(<ModifierArray<"Deadzone">> { modifier: "Deadzone", settings: { lowerThreshold: 0.05, upperThreshold: 1 } });
    // RunService.BindToRenderStep("InputManager", Enum.RenderPriority.Input.Value + 2, (delta: number) => {
    //     process(delta, inputMapping);
    //     // print("Value: ", inputMapping.Value, ", State: ", inputMapping.State);
    // });
    // InputManager.Init();


}


export function TestAction() {
    // 1. Define the schemas for our actions, binding multiple keys to each

    const ActionApi = new ActionCreationApi();

    ActionApi.AddFromConfig();
    // ActionApi.AddAction(EGameplayInputActions.Move, true);
    // ActionApi.AddMappingForAction(
    //     EGameplayInputActions.Move,
    //     new InputMapping(Enum.KeyCode.W)
    //         .SetModifiers(
    //             { modifier: "Negate" },
    //             { modifier: "InputSwizzle", settings: { order: "ZYX" } },
    //         )
    // );

    // ActionApi.AddMappingForAction(
    //     EGameplayInputActions.Move,
    //     new InputMapping(Enum.KeyCode.A)
    //         .SetModifiers(
    //             { modifier: "Negate" },
    //         )
    // );

    // ActionApi.AddMappingForAction(
    //     EGameplayInputActions.Move,
    //     new InputMapping(Enum.KeyCode.S)
    //         .SetModifiers(
    //             { modifier: "InputSwizzle", settings: { order: "ZYX" } },
    //         )
    // );

    // ActionApi.AddMappingForAction(
    //     EGameplayInputActions.Move,
    //     new InputMapping(Enum.KeyCode.D)

    // );

    // ActionApi.AddMappingForAction(
    //     EGameplayInputActions.Move,
    //     new InputMapping(Enum.KeyCode.Thumbstick1)
    //         .SetActionValueType(ActionValueType.Axis2D)
    //         .SetModifiers(
    //             { modifier: "Deadzone", settings: { lowerThreshold: 0.05, upperThreshold: 1 } },
    //             { modifier: "InputSwizzle", settings: { order: "XZY" } },
    //         )
    // );

    // 3. Store all actions in an array for easy processing


    DeviceDetector.onInputDeviceTypeChanged.Connect((deviceType: DeviceType) => {
        for (const [actionName, action] of ActionApi.ActionMap) {
            action.SetCurrentDeviceTypeContext(deviceType);
        }
    });



    // 4. Initialize the main Input Manager
    InputManager.Init();
    print("Action test started. Press WASD to see actions trigger.");


    // 5. Bind a function to the game's render loop to check for input
    RunService.BindToRenderStep("ActionTestLoop", Enum.RenderPriority.Input.Value + 2, (delta) => {
        // On each frame, update the state of every action
        debug.profilebegin("ActionTestLoop");
        for (const [actionName, action] of ActionApi.ActionMap) {
            action.UpdateState(delta);

            // If the action was just triggered this frame, print its details
            if (action.isTriggered()) {
                // print(`ACTION TRIGGERED: ${actionName}, Value: ${action.GetValue()}`);
            }
        }
        debug.profileend();
    });
}
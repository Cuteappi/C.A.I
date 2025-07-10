import { compose, Mods } from "shared/ContextActionInput/Modifiers";
import { InputMapping } from "shared/ContextActionInput/InputMapping";
import { InputManager } from "shared/ContextActionInput/InputManager/InputManager";
import { GamepadService, RunService } from "@rbxts/services";
import { DeviceType } from "shared/ContextActionInput/Models/types";
import { DeviceDetector } from "shared/ContextActionInput/DeviceTypeDetector";
import { InputContext } from "shared/ContextActionInput/InputContext";
import { EDebugInputActions, EGameplayInputActions, InputContextType } from "shared/ContextActionInput/Models/Enums";
import { CAI } from "shared/ContextActionInput/CAI";
import { DefaultContextActionKeyConfig } from "shared/ContextActionInput/DefaultActionKeyConfigs";

function process(delta: number, inputMapping: InputMapping) {
    debug.profilebegin("Test InputMapping for values");
    inputMapping.UpdateState(delta);
    debug.profileend();
}


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

    const GamePlayContext = new InputContext(InputContextType.GamePlay);

    GamePlayContext.AddFromConfig();

    // 3. Store all actions in an array for easy processing


    DeviceDetector.onInputDeviceTypeChanged.Connect((deviceType: DeviceType) => {
        for (const [actionName, action] of GamePlayContext.ActionMap) {
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
        for (const [actionName, action] of GamePlayContext.ActionMap) {
            action.UpdateState(delta);

            // If the action was just triggered this frame, print its details
            if (action.IsTriggered()) {
                // print(`ACTION TRIGGERED: ${actionName}, Value: ${action.GetValue()}`);
            }
        }
        debug.profileend();
    });
}

export function TestRemap() {
    const GamePlayContext = new InputContext(InputContextType.GamePlay);
    GamePlayContext.AddFromConfig();

    DeviceDetector.onInputDeviceTypeChanged.Connect((deviceType: DeviceType) => {
        for (const [actionName, action] of GamePlayContext.ActionMap) {
            action.SetCurrentDeviceTypeContext(deviceType);
        }
    });

    InputManager.Init();
    print("Action test started. Press WASD to see actions trigger.");

    RunService.BindToRenderStep("ActionTestLoop", Enum.RenderPriority.Input.Value + 2, (delta) => {
        // On each frame, update the state of every action
        debug.profilebegin("ActionTestLoop");
        for (const [actionName, action] of GamePlayContext.ActionMap) {
            action.UpdateState(delta);

            // If the action was just triggered this frame, print its details
            if (action.IsTriggered()) {
                print(`ACTION TRIGGERED: ${actionName}, Value: ${action.GetValue()}`);
            }
        }
        debug.profileend();
    });

    task.wait(5);
    print("Before remap: ", InputManager.GetActiveKeys());
    GamePlayContext.ReMapActionKey(EGameplayInputActions.Interact, Enum.KeyCode.E, Enum.KeyCode.F);
    print("After remap: ", InputManager.GetActiveKeys());

}



export function TestCAI() {
    // Initialize CAI
    CAI.AddConfigContexts(DefaultContextActionKeyConfig);
    CAI.GamePlayContext.Assign();
    CAI.DebugContext.Assign();

    InputManager.Init();
    CAI.Init();

    print("CAI Test Passed!");

    RunService.BindToRenderStep("ActionValueTest", Enum.RenderPriority.Input.Value + 3, (delta) => {
        const moveAction = CAI.GamePlayContext.ActionMap.get(EGameplayInputActions.Move)!;
        const interactAction = CAI.GamePlayContext.ActionMap.get(EGameplayInputActions.Interact)!;
        const debugAction = CAI.DebugContext.ActionMap.get(EDebugInputActions.Toggle)!;

        // print(`Move Action Value: ${moveAction.GetValue()}`);
        // print(`Interact Action Value: ${interactAction.GetValue()}, Debug Action Value: ${debugAction.GetValue()}`);
    });

    task.wait(2);

    print("Active keys: ", InputManager.GetActiveKeys());
    CAI.GamePlayContext.ActionMap.get(EGameplayInputActions.Interact)!.ReMapActionKey(Enum.KeyCode.E, Enum.KeyCode.F);
    CAI.DebugContext.UnAssign();

    print("Active keys: ", InputManager.GetActiveKeys());

    task.wait(1);
    CAI.GamePlayContext.UnAssign();

    print("Active keys: ", InputManager.GetActiveKeys());

    task.wait(1);
    CAI.GamePlayContext.Assign();

    print("Active keys: ", InputManager.GetActiveKeys());
}

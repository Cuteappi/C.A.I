import { AddModifiers, compose, Mods } from "../../shared/ContextActionInput/Modifiers";
import { InputMapping } from "shared/ContextActionInput/InputMapping";
import { InputManager } from "shared/ContextActionInput/InputManager/InputManager";
import { GamepadService, RunService } from "@rbxts/services";
import { ActionValueType, PositionType, Axis, EGameplayInputActions } from "shared/ContextActionInput/Models/Enums";
import { Action } from "shared/ContextActionInput/OldAction";
import { InitActionSchema, InitInputMappingSchema } from "shared/ContextActionInput/Models/InitActionSchema";

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
    const inputMapping = new InputMapping<"PressedTrigger">(
        EGameplayInputActions.Move,
        key,
        ActionValueType.Bool,
        { Type: "PressedTrigger" },
    );
    // inputMapping.ChangeTrigger("ReleasedTrigger");
    // inputMapping.AddModifiers(<ModifierArray<"Deadzone">> { modifier: "Deadzone", settings: { lowerThreshold: 0.05, upperThreshold: 1 } });
    RunService.BindToRenderStep("InputManager", Enum.RenderPriority.Input.Value + 2, (delta: number) => {
        process(delta, inputMapping);
        // print("Value: ", inputMapping.Value, ", State: ", inputMapping.State);
    });
    InputManager.Init();


}


export function TestAction() {
    // 1. Define the schemas for our actions, binding multiple keys to each
    const MoveActionSchema: InitActionSchema = {
        KeyboardMouse: [
            {
                Key: Enum.KeyCode.W,
                Trigger: { Type: "DownTrigger" },
                ActionValueType: ActionValueType.Bool,
                Axis: Axis.X,
                PositionType: PositionType.Position,
                Modifiers: AddModifiers(
                    { modifier: "Negate" },
                    { modifier: "InputSwizzle", settings: { order: "ZYX" } }),
            } as InitInputMappingSchema<"DownTrigger">,
            {
                Key: Enum.KeyCode.A,
                Trigger: { Type: "DownTrigger" },
                ActionValueType: ActionValueType.Bool,
                Axis: Axis.X,
                PositionType: PositionType.Position,
                Modifiers: AddModifiers(
                    { modifier: "Negate" }),
            } as InitInputMappingSchema<"DownTrigger">,
            {
                Key: Enum.KeyCode.S,
                Trigger: { Type: "DownTrigger" },
                ActionValueType: ActionValueType.Bool,
                Axis: Axis.X,
                PositionType: PositionType.Position,
                Modifiers: AddModifiers(
                    { modifier: "InputSwizzle", settings: { order: "ZYX" } }),
            } as InitInputMappingSchema<"DownTrigger">,
            {
                Key: Enum.KeyCode.D,
                Trigger: { Type: "DownTrigger" },
                ActionValueType: ActionValueType.Bool,
                Axis: Axis.X,
                PositionType: PositionType.Position,
                Modifiers: [],
            } as InitInputMappingSchema<"DownTrigger">,
        ],
    };

    const CrouchActionSchema: InitActionSchema = {
        KeyboardMouse: [
            {
                Key: Enum.KeyCode.C,
                Trigger: { Type: "PressedTrigger" },
                ActionValueType: ActionValueType.Bool,
                Axis: Axis.X,
                PositionType: PositionType.Position,
                Modifiers: [],
            } as InitInputMappingSchema<"PressedTrigger">,
            {
                Key: Enum.KeyCode.LeftControl,
                Trigger: { Type: "DownTrigger" },
                ActionValueType: ActionValueType.Bool,
                Axis: Axis.X,
                PositionType: PositionType.Position,
                Modifiers: [],
            } as InitInputMappingSchema<"DownTrigger">,
        ],
    };

    // 2. Create the action instances from the schemas
    const MoveAction = new Action(EGameplayInputActions.Move, MoveActionSchema, true);
    const CrouchAction = new Action(EGameplayInputActions.Crouch, CrouchActionSchema);

    // 3. Store all actions in an array for easy processing
    const allActions = [MoveAction];

    // 4. Initialize the main Input Manager
    InputManager.Init();
    print("Action test started. Press WASD to see actions trigger.");

    // 5. Bind a function to the game's render loop to check for input
    RunService.BindToRenderStep("ActionTestLoop", Enum.RenderPriority.Input.Value + 2, (delta) => {
        // On each frame, update the state of every action
        for (const action of allActions) {
            action.UpdateState(delta);

            // If the action was just triggered this frame, print its details
            if (action.isTriggered()) {
                print(`ACTION TRIGGERED: ${action.Name}, Value: ${action.Value}`);
            }
        }
    });
}
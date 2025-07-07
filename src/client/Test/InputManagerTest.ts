import { compose, Mods } from "../../shared/ContextActionInput/Modifiers";
import { InputMapping, ModifierArray } from "shared/ContextActionInput/InputMapping";
import { InputManager } from "../../shared/ContextActionInput/InputManager";
import { GamepadService, RunService } from "@rbxts/services";
import { ActionValueType, PositionType, Axis } from "shared/ContextActionInput/Enums";


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

    const key = Enum.KeyCode.Thumbstick1;
    InputManager.AddActiveKey(key);
    print(InputManager.activeKeys);
    const inputMapping = new InputMapping(key, ActionValueType.Axis2D);
    inputMapping.AddModifiers(<ModifierArray<"Deadzone">> { modifier: "Deadzone", settings: { lowerThreshold: 0.05, upperThreshold: 1 } });
    RunService.BindToRenderStep("InputManager", Enum.RenderPriority.Input.Value + 2, (delta: number) => {
        process(delta, inputMapping);
        // print("Value: ", inputMapping.Value, ", State: ", inputMapping.State);
    });
    InputManager.Init();


}

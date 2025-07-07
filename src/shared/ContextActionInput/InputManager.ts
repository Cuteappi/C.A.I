import Signal from "@rbxts/lemon-signal";
import Object from "@rbxts/object-utils";
import { ContextActionService, RunService } from "@rbxts/services";
import { RawInputData } from "./RawInputData";
import { GetCorrespondingKey, GetKeyMode, IsJoyStick } from "./Utility";
import { TAllKeysCategorizedValues, AllKeysCategorized } from "./InputTypes";

const DEFAULT_PRIORITY = 1;
const BIND_ALL_KEYS_ACTION_NAME = "BIND_ALL_KEYS";


export namespace InputManager {

    export const activeKeys = new Map<TAllKeysCategorizedValues, RawInputData>();


    export function AddActiveKey(key: TAllKeysCategorizedValues) {
        if (activeKeys.has(key)) return;
        activeKeys.set(key, new RawInputData(key));
    }

    export function RemoveActiveKey(key: TAllKeysCategorizedValues) {
        activeKeys.delete(key);
    }



    /* -------------------------------------------------------------------------- */
    /*                    Update Function that run every frame                    */
    /* -------------------------------------------------------------------------- */
    function Update() {
        debug.profilebegin("InputManager Update");
        for (const [key, value] of activeKeys) {
            value.UpdateKeybuffer(); // Has to be first since the isActive is used to update current

            if (value.IsChanged) {
                value.IsChanged = false;
                value.IsActive = false;
            }

            if (IsJoyStick(key) && value.Position.Magnitude > 0) {
                value.IsActive = true;
            }
            // print("current: ", value.KeyBuffer.Current, ", prev: ", value.KeyBuffer.Previous, ", position: ", value.Position);
        }
        debug.profileend();
    }




    /* -------------------------------------------------------------------------- */
    /*                            OnInput Function                                */
    /* -------------------------------------------------------------------------- */
    function OnInput(actionName: string, state: Enum.UserInputState, input: InputObject) {
        debug.profilebegin("InputManager Input Processing");


        const key = GetCorrespondingKey(GetKeyMode.InputObject, input);
        if (!key) return;
        if (!activeKeys.has(key)) return;


        const InputData = activeKeys.get(key);
        if (!InputData) return;

        if (input.UserInputState === Enum.UserInputState.Begin) { InputData.IsActive = true; }
        else if (input.UserInputState === Enum.UserInputState.End) { InputData.IsActive = false; }
        else if (input.UserInputState === Enum.UserInputState.Change) {
            InputData.IsActive = true;
            InputData.Delta = input.Delta;
            InputData.Position = input.Position;
            InputData.IsChanged = true;
        }
        // added to handle all relevant states
        else if (input.UserInputState === Enum.UserInputState.Cancel) { InputData.IsActive = false; }


        debug.profileend();
    }



    /* -------------------------------------------------------------------------- */
    /*                              Bind Functions                                */
    /* -------------------------------------------------------------------------- */
    function BindToRunService() {
        RunService.BindToRenderStep("InputManager", Enum.RenderPriority.Input.Value + 1, () => {
            debug.profilebegin("InputManager Update");
            Update();
            debug.profileend();
        });
    }


    function BindToCAS() {
        ContextActionService.BindActionAtPriority(
            BIND_ALL_KEYS_ACTION_NAME,
            OnInput,
            false,
            DEFAULT_PRIORITY,
            ...Object.values([
                ...Object.values(AllKeysCategorized.Buttons.KeyboardButtons),
                ...Object.values(AllKeysCategorized.Buttons.MouseButtons),
                ...Object.values(AllKeysCategorized.Axis1D.JoySticks),
                ...Object.values(AllKeysCategorized.Buttons.JoyButtons),
                ...Object.values(AllKeysCategorized.Axis1D.MouseActions),
            ]),
        );
    }


    /* -------------------------------------------------------------------------- */
    /*                              Init Functions                                */
    /* -------------------------------------------------------------------------- */
    export function Init() {
        BindToRunService();
        BindToCAS();
    }

    export function InitTest() {

        AddActiveKey(Enum.KeyCode.Thumbstick1);

        print(activeKeys);

        BindToRunService();
        BindToCAS();
    }
}


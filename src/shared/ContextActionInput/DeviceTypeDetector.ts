import Signal from "@rbxts/lemon-signal";
import { UserInputService } from "@rbxts/services";
import { DeviceType, DeviceTypeRecord } from "./Models/types";

function determinePreferred(inputType: Enum.UserInputType) {
    let newType: DeviceType | undefined;

    if (string.sub(inputType.Name, 1, 7) === "Gamepad") {
        newType = DeviceTypeRecord.Gamepad;
    } else if (inputType === Enum.UserInputType.Touch) {
        newType = DeviceTypeRecord.Touch;
    } else if (
        inputType === Enum.UserInputType.Keyboard || string.sub(inputType.Name, 1, 5) === "Mouse"
    ) {
        newType = DeviceTypeRecord.MouseKeyboard;
    } else {
        return;
    }

    if (DeviceDetector.previousInputType === newType) return;

    DeviceDetector.previousInputType = newType;
    DeviceDetector.onInputDeviceTypeChanged.Fire(newType);
}

export namespace DeviceDetector {
    export let previousInputType: DeviceType | undefined;
    export const onInputDeviceTypeChanged = new Signal<DeviceType>();
    let connection: RBXScriptConnection | undefined;

    export function init() {
        if (connection) return;
        connection = UserInputService.LastInputTypeChanged.Connect(determinePreferred);
        determinePreferred(UserInputService.GetLastInputType());
    }

    export function destroy() {
        if (connection) {
            connection.Disconnect();
            connection = undefined;
        }
        onInputDeviceTypeChanged.Destroy();
    }

    export function getPreviousInputType() {
        return previousInputType;
    }
}

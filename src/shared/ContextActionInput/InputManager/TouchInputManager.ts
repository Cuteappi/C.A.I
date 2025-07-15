import { ContextActionService, RunService } from "@rbxts/services";
import { RawInputData } from "./RawInputData";


export namespace TouchInputManager {
	export const GuiObjectList: Array<{ gui: GuiObject, zIndex: number; }> = [];


	const activeInputObjects = new Map<string, InputObject>();
	const activeKeys = new Map<string, RawInputData>();

	export function AddTouchKey(keyName: string, gui: GuiObject, zIndex: number) {
		activeKeys.set(keyName, new RawInputData(keyName));
		GuiObjectList.push({ gui, zIndex });
	}


	function getGuiObject(position: Vector3) {
		let candidate: { gui: GuiObject, zIndex: number; } | boolean = false;
		for (const value of GuiObjectList) {
			const frameCornerTopLeft: Vector2 = value.gui.AbsolutePosition;
			const frameCornerBottomRight = frameCornerTopLeft.add(value.gui.AbsoluteSize);

			if (position.X >= frameCornerTopLeft.X && position.Y >= frameCornerTopLeft.Y) {
				if (position.X <= frameCornerBottomRight.X && position.Y <= frameCornerBottomRight.Y) {
					if (candidate === false || value.zIndex > candidate.zIndex) {
						candidate = value;
					}
				}
			}
		}

		return candidate;
	}

	function OnInput(actionName: string, state: Enum.UserInputState, input: InputObject) {


		if (input.UserInputState === Enum.UserInputState.Begin) {
			const guiObject = getGuiObject(input.Position);
			if (!guiObject) return;
			if (activeInputObjects.has(guiObject.gui.Name)) { warn("Input already active"); return; }
			activeInputObjects.set(guiObject.gui.Name, input);

			const InputData = activeKeys.get(guiObject.gui.Name);
			if (!InputData) { warn("InputData not found"); return; }

			InputData.IsActive = true;
			InputData.TouchActive = true;
			InputData.Delta = input.Delta;
			InputData.TouchStartPosition = input.Position;
			InputData.Position = input.Position;
			InputData.IsChanged = true;
			return;

		}
		else if (input.UserInputState === Enum.UserInputState.Change) {
			for (const [key, value] of activeInputObjects) {
				if (value === input) {
					const InputData = activeKeys.get(key);
					if (!InputData) { warn("InputData not found"); return; }
					InputData.IsActive = true;
					InputData.TouchActive = true;
					InputData.Delta = input.Delta;
					InputData.Position = input.Position;
					InputData.IsChanged = true;
					return;
				}
			}
			warn("Input not active");
		}
		else if (input.UserInputState === Enum.UserInputState.End) {
			for (const [key, value] of activeInputObjects) {
				if (value === input) {
					activeInputObjects.delete(key);
					const InputData = activeKeys.get(key);
					if (!InputData) { warn("InputData not found"); return; }
					InputData.IsActive = false;
					InputData.TouchActive = false;
					return;
				}
			}
		}
	}

	function Update() {
		for (const [key, value] of activeKeys) {
			value.UpdateKeybuffer(); // Has to be first since the isActive is used to update current
			// print(value);
			if (value.IsChanged) {
				value.IsChanged = false;
				value.IsActive = false;
			}
			if (value.TouchActive) {
				value.IsActive = true;
			}
			// print("current: ", value.KeyBuffer.Current, ", prev: ", value.KeyBuffer.Previous, ", position: ", value.Position);
		}
	}



	function BindToRunService() {
		RunService.BindToRenderStep("InputManager", Enum.RenderPriority.Input.Value + 1, () => {
			debug.profilebegin("InputManager Update");
			Update();
			debug.profileend();
		});
	}

	function BindToCAS() {
		ContextActionService.BindActionAtPriority(
			"Touch test",
			OnInput,
			false,
			1,
			Enum.UserInputType.Touch
		);
	}

	export function Init() {
		BindToCAS();
		BindToRunService();
		print("init");

		RunService.BindToRenderStep("InputManager", Enum.RenderPriority.Input.Value + 1, () => {
			const thumbstick = activeKeys.get("Thumbstick")!.KeyBuffer;
			const buttonA = activeKeys.get("ButtonA")!.KeyBuffer;
			print("thumbstick: ", thumbstick.Current, "buttonA: ", buttonA.Current);
		});
	}

}

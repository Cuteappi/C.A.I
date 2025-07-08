// import { ActionsController } from "./ActionsController";
// import { IInputMap, InputContextType, EInputActions, InputKeyCode, EDebugInputActions } from "./Enums";

// export class InputContext {
// 	public readonly Name: InputContextType;
// 	private _assign: boolean = false;

// 	constructor(name: InputContextType) {
// 		this.Name = name;
// 	}

// 	AddAction(ActionName: EInputActions, inputMap: IInputMap) {
// 		const keycodes: InputKeyCode[] = [];
// 		if (inputMap.Gamepad) {
// 			keycodes.push(inputMap.Gamepad);
// 		}
// 		if (inputMap.KeyboardAndMouse) {
// 			keycodes.push(inputMap.KeyboardAndMouse);
// 		}
// 		ActionsController.AddAction(this.Name, ActionName, keycodes);
// 	}

// 	RemoveAction(ActionName: InputActions) {
// 		ActionsController.RemoveAction(this.Name, ActionName);
// 	}
// 	Assign() {
// 		this._assign = true;
// 		//update cas bind all corresponding actions and unbind
// 	}

// 	Unassign() {
// 		this._assign = false;
// 	}

// 	UpdateActionKeys() {}
// }

// export namespace InputContextController {
// 	export function CreateInputContext(name: InputContextType) {
// 		return new InputContext(name);
// 	}

// 	export const DebugContext = CreateInputContext(InputContextType.Debug);
// 	DebugContext.AddAction(DebugInputActions.Toggle, { KeyboardAndMouse: Enum.KeyCode.F2 });
// 	// const GameplayContext = CreateInputContext(InputContextType.GamePlay);
// 	// GameplayContext.AddAction(GameplayInputActions.Jump, {KeyboardAndMouse: Enum.KeyCode.Space});
// 	// const MenuContext = CreateInputContext(InputContextType.Menu);

// 	//TODO add default binds for ui and gameplay
// }

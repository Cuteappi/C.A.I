import { InputContext } from "./InputContext";
import { InputContextType } from "./Models/Enums";
import { RunService } from "@rbxts/services";
import { RenderPriorities } from "./Utility/RenderPriorities";
import { DeviceDetector } from "./DeviceTypeDetector";
import { ContextActionKeyConfig } from "./DefaultActionKeyConfigs";
import Object from "@rbxts/object-utils";
import { InputManager } from "./InputManager/InputManager";

export namespace CAI {
    const _contexts: Map<InputContextType, InputContext> = new Map<InputContextType, InputContext>();

    export function CreateInputContext(name: InputContextType): InputContext {
        const context = new InputContext(name);
        _contexts.set(name, context);
        return context;
    }

    export const DebugContext = CreateInputContext(InputContextType.Debug);
    export const GamePlayContext = CreateInputContext(InputContextType.GamePlay);
    export const MenuContext = CreateInputContext(InputContextType.Menu);

    export function AddConfigContexts(config: ContextActionKeyConfig) {
        for (const [contextName, context] of Object.entries(config)) {
            switch (contextName) {
                case InputContextType.Debug:
                    DebugContext.AddFromConfig(context);
                    break;
                case InputContextType.GamePlay:
                    GamePlayContext.AddFromConfig(context);
                    break;
                case InputContextType.Menu:
                    MenuContext.AddFromConfig(context);
                    break;
            }

        }
    }

    //TODO add default binds for ui and gameplay

    export function GetAssignedContexts() {
        const assignedContexts: Map<InputContextType, InputContext> = new Map<InputContextType, InputContext>();
        for (const [contextName, context] of _contexts) {
            if (context.Assigned) assignedContexts.set(contextName, context);
        }
        return assignedContexts;
    }

    function BindToRenderStep() {
        RunService.BindToRenderStep("InputContextController", RenderPriorities.UpdateActionsActivation, (delta: number) => {
            for (const [contextName, context] of _contexts) {
                if (context.Assigned) context.UpdateState(delta);
            }
        });
    }

    export function Init() {

        for (const [contextName, context] of _contexts) {
            context.Init();
        }
        InputManager.Init();
        BindToRenderStep();
    }
}

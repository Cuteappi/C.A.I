import { ActionState, EInputActions } from "./Enums";
import { InputMapping } from "./InputMapping";

export type MappingContext = {
    KeyboardMouse?: InputMapping[];
    Gamepad?: InputMapping[];
};

export class Action {
    public ActionName: EInputActions;
    public ActionState: ActionState = ActionState.Completed;
    public MappingContext?: MappingContext;
    public IsRebindable: boolean = true;

    constructor(ActionName: EInputActions, MappingContext?: MappingContext) {
        this.ActionName = ActionName;
        this.MappingContext = MappingContext;
    }

    public BindAction() { }

    public Press() { }

    public Release() { }

    public AddMappingContext() { }

    public RemoveMappingContext() { }

    public AddInputMapping() { }

    public RemoveInputMapping() { }
}

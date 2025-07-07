// import { EInputActions } from "client/ContextActionInput/Enums";
// import { Trigger } from "client/ContextActionInput/Triggers";
// import { EActionSpace } from "client/ContextActionInput/Enums";
// import { BooleanAction } from "client/ContextActionInput/ActionController/ActionSpaces/BooleanAction";
// import { OneDAction } from "client/ContextActionInput/ActionController/ActionSpaces/OneDAction";
// import { TwoDAction } from "client/ContextActionInput/ActionController/ActionSpaces/TwoDAction";
// import { ThreeDAction } from "client/ContextActionInput/ActionController/ActionSpaces/ThreeDAction";

// export namespace ActionSpace {
// 	export function createAction(
// 		name: EInputActions,
// 		actionSpace: EActionSpace,
// 		triggers: Trigger[],
// 	): Action | undefined {
// 		switch (actionSpace) {
// 			case EActionSpace.boolean:
// 				return new BooleanAction(name, triggers);
// 			case EActionSpace.OneD:
// 				return new OneDAction(name, triggers);
// 			case EActionSpace.TwoD:
// 				return new TwoDAction(name, triggers);
// 			case EActionSpace.ThreeD:
// 				return new ThreeDAction(name, triggers);
// 			default:
// 				warn(`Invalid action space '${actionSpace}' given for action '${name}'`);
// 				return undefined;
// 		}
// 	}
// }

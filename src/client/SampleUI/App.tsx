import Vide from "@rbxts/vide";
import { usePx } from "./Composables/usePx";
import { Players } from "@rbxts/services";
import { TouchInputManager } from "shared/ContextActionInput/InputManager/TouchInputManager";

function App(){
	usePx();
	return (
		<screengui>
			<frame 
				Size={() => UDim2.fromScale(0.4, 0.5)}
				Position={()=> UDim2.fromScale(0, 0.5)}
				BackgroundColor3={Color3.fromHex("#000000")}
				BackgroundTransparency={0.75}
				Name="Thumbstick"
				action={
					(instance: Frame) => {
						TouchInputManager.AddTouchKey(instance.Name, instance, 1);
					}
				}
			>
				<frame
					Name="ButtonA"
					Size={() => UDim2.fromScale(0.4, 0.4)}
					Position={()=> UDim2.fromScale(0.6, 0.2)}
					BackgroundColor3={Color3.fromHex("#000000")}
					BackgroundTransparency={0.75}
					action={
						(instance: Frame) => {
							TouchInputManager.AddTouchKey(instance.Name, instance, 2);
						}
					}
				/>
			</frame>
		</screengui>
	)
}

export function run(){
    Vide.mount(() => <App />, Players.LocalPlayer.WaitForChild("PlayerGui"));
}

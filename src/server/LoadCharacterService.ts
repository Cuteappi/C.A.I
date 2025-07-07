import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";

export class LoadCharacterService {
    static CustomCharacterName = "Character";

    static ApplyCustomCharacter(player: Player) {
        const characterTemplate = ReplicatedStorage.FindFirstChild(this.CustomCharacterName);
        if (!characterTemplate || !characterTemplate.IsA("Model")) {
            warn(
                `[CustomCharacterService] No model named '${this.CustomCharacterName}' found in ReplicatedStorage`,
            );
            return;
        }

        if (player.Character) {
            player.Character.Destroy();
        }
        const newCharacter = characterTemplate.Clone();
        newCharacter.Name = player.Name;
        newCharacter.Parent = Workspace;

        player.Character = newCharacter;
        const RootPart: BasePart = (player.Character! as Model).FindFirstChild(
            "RootPart",
        ) as BasePart;
        const spawnLocation = Workspace.FindFirstChild("SpawnLocation") as BasePart;
        RootPart.CFrame = new CFrame(spawnLocation.Position).add(
            new Vector3(0, player.Character!.GetExtentsSize().Y + spawnLocation.Size.Y / 2, 0),
        );
    }
}

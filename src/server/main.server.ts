import { Players } from "@rbxts/services";
import { LoadCharacterService } from "./LoadCharacterService";

Players.CharacterAutoLoads = false;

Players.PlayerAdded.Connect((player: Player) => {
    LoadCharacterService.ApplyCustomCharacter(player);
});

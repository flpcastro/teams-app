import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/storage-config";
import { GetPlayersByGroup } from "./get-players-by-group";

export async function DeletePlayerByGroup(playerName: string, group: string) {
  try {
    const storage = await GetPlayersByGroup(group);

    const filtered = storage.filter(player => player.name !== playerName);

    const players = JSON.stringify(filtered);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players);
  } catch (err) {
    throw err;
  }
}
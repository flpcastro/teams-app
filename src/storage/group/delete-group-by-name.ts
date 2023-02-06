import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storage-config";
import { getAllGroups } from "./get-all-groups";

export async function DeleteGroupByName(deletedGroupName: string) {
  try {
    const storedGroups = await getAllGroups();

    const groups = storedGroups.filter(group => group !== deletedGroupName);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${deletedGroupName}`);
  } catch (err) {
    throw err;
  }
}
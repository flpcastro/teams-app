import { GetPlayersByGroup } from "./get-players-by-group";

export async function GetPlayerByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await GetPlayersByGroup(group);

    const player = storage.filter(player => player.team === team);

    return player;
  } catch (err) {
    throw err;
  }
}
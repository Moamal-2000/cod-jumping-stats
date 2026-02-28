import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "./msgpackClient";

export async function getPlayerById({ playerId, datatype }) {
  if (playerId === undefined) {
    console.error("playerId is undefined");
    return null;
  }

  const response = await fetchMsgPackResponse({ url: jhApis().player.all });
  const players = (await decodeAsyncData(response, datatype)) ?? [];

  return players.find((player) => +player.PlayerID === +playerId);
}

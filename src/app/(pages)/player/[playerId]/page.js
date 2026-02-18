import { jhApis } from "@/api/jumpersHeaven";
import PlayerProfilePanels from "@/components/Pages/PlayerProfile/PlayerProfilePanels";
import {
  buildPlayerDescription,
  decodeAsyncData,
  fetchMsgPackResponse,
  stripColorCodes,
} from "@/functions/utils";
import { Suspense } from "react";

export const revalidate = 86400; // 1 day

export async function generateMetadata({ params }) {
  const { playerId } = await params;

  try {
    const response = await fetchMsgPackResponse({ url: jhApis().player.all });
    const players = (await decodeAsyncData(response)) ?? [];

    const player = players.find((player) => +player.PlayerID === +playerId);

    const purePlayerName =
      stripColorCodes(player?.PlayerName || player?.PrefName) ||
      `Player ${playerId}`;
    const playerDescription = buildPlayerDescription(player);

    return {
      title: `${purePlayerName} Profile | JumpersHeaven`,
      description: playerDescription,
    };
  } catch (error) {
    return {
      title: `Player ${playerId} Profile | JumpersHeaven`,
      description: `JumpersHeaven player profile and statistics for player ID ${playerId}.`,
    };
  }
}

async function PlayerPage({ params }) {
  const { playerId } = await params;

  return (
    <Suspense>
      <PlayerProfilePanels playerId={playerId} />
    </Suspense>
  );
}

export default PlayerPage;

import PlayerProfilePanels from "@/components/Pages/PlayerProfile/PlayerProfilePanels";
import {
  buildPlayerDescription,
  fetchPlayers,
  stripColorCodes,
} from "@/functions/utils";
import { Suspense } from "react";

export const revalidate = 1000 * 60 * 60 * 24; // 1 day

export async function generateMetadata({ params }) {
  const { playerId } = await params;

  const allPlayersData = (await fetchPlayers({ sort: "admin" })) || [];

  const player =
    allPlayersData.find((player) => player.PlayerID === +playerId) || {};

  const purePlayerName =
    stripColorCodes(player.PrefName || player.PlayerName) || "Unknown Player";
  const playerDescription = buildPlayerDescription(player);

  return {
    title: `${purePlayerName} Profile | JumpersHeaven`,
    description: playerDescription,
  };
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

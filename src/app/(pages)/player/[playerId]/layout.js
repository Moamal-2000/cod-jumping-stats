import PlayerPageFallback from "@/components/Pages/PlayerProfile/PlayerPageFallback/PlayerPageFallback";
import PlayerProfileLayout from "@/components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";
import { fetchPlayers } from "@/functions/utils";

export async function generateStaticParams() {
  const allPlayersData = await fetchPlayers({ sort: "admin" });
  const playerIds = allPlayersData.map((player) => ({
    playerId: `${player.PlayerID}`,
  }));

  return playerIds;
}

function PlayerLayoutContent({ children, playerId }) {
  const isPlayerIdNumber = Number.isInteger(Number(playerId));

  return (
    <>
      {!isPlayerIdNumber && <PlayerPageFallback />}

      {isPlayerIdNumber && (
        <PlayerProfileLayout playerId={+playerId}>
          {children}
        </PlayerProfileLayout>
      )}
    </>
  );
}

export default async function PlayerLayout({ children, params }) {
  const { playerId } = await params;

  return (
    <PlayerLayoutContent playerId={playerId}>{children}</PlayerLayoutContent>
  );
}

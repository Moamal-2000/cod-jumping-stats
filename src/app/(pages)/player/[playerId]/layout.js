import PlayerPage from "@/components/Pages/PlayerProfile/PlayerPage/PlayerPage";
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
  const isPlayerIdNumber = !isNaN(+playerId);

  return (
    <>
      {!isPlayerIdNumber && <PlayerPage />}

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

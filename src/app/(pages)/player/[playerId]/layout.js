import PlayerPageFallback from "@/components/Pages/PlayerProfile/PlayerPageFallback/PlayerPageFallback";
import PlayerProfileLayout from "@/components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";

function PlayerLayoutContent({ children, playerId }) {
  const isPlayerIdNumber = Number.isInteger(Number(playerId));

  return isPlayerIdNumber ? (
    <PlayerProfileLayout playerId={+playerId}>{children}</PlayerProfileLayout>
  ) : (
    <PlayerPageFallback />
  );
}

export default async function PlayerLayout({ children, params }) {
  const { playerId } = await params;

  return (
    <PlayerLayoutContent playerId={playerId}>{children}</PlayerLayoutContent>
  );
}

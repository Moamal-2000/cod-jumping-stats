import PlayerPageFallback from "@/components/Pages/PlayerProfile/PlayerPageFallback/PlayerPageFallback";
import PlayerProfileLayout from "@/components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";
import {
  buildPlayerDescription,
  getPlayerById,
  stripColorCodes,
} from "@/functions/utils";

export async function generateMetadata({ params }) {
  const { playerId } = await params;
  const player = await getPlayerById({ playerId });

  const playerName = player?.PrefName || player?.PlayerName;
  const purePlayerName = stripColorCodes(playerName);

  const title = `${purePlayerName} Profile | JumpersHeaven`;
  const description = buildPlayerDescription(player);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Jumpers Heaven Stats",
      authors: ["Moamal Alaa", "Dcoy"],
    },
  };
}

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

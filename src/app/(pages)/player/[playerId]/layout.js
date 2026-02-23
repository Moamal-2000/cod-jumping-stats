import PlayerPageFallback from "@/components/Pages/PlayerProfile/PlayerPageFallback/PlayerPageFallback";
import PlayerProfileLayout from "@/components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";
import { getOpenGraphMetadata } from "@/data/metadata";
import {
  buildPlayerDescription,
  getPlayerById,
  stripColorCodes,
} from "@/functions/utils";
import { size } from "./opengraph-image";

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
    ...getOpenGraphMetadata({
      title,
      description,
      imageUrl: `https://stats.jumpersheaven.com/player/${playerId}/opengraph-image`,
      imageAlt: "Jumpers Heaven Player Profile",
      pagePath: `/player/${playerId}`,
      imageType: "image/png",
      imageSize: size,
    }),
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

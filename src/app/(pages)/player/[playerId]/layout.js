import PlayerPageFallback from "@/components/Pages/PlayerProfile/PlayerPageFallback/PlayerPageFallback";
import PlayerProfileLayout from "@/components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";
import { SITE_URL } from "@/data/metadata";
import { getPlayerById } from "@/lib/api/playersApi";
import {
  getOpenGraphMetadata,
  getPlayerOgDescription,
  getPlayerSeoDescription,
} from "@/lib/metadata";
import { stripColorCodes } from "@/lib/utils";
import { size } from "./opengraph-image";

export async function generateMetadata({ params }) {
  const { playerId } = await params;
  const player = await getPlayerById({ playerId });

  const playerName = player?.PrefName || player?.PlayerName;
  const purePlayerName = stripColorCodes(playerName);

  const title = `${purePlayerName} Profile | JumpersHeaven`;
  const seoDescription = getPlayerSeoDescription(player);
  const ogDescription = getPlayerOgDescription(player);

  const generatedMetadata = {
    title,
    description: seoDescription,
    metadataBase: new URL(SITE_URL),
    ...getOpenGraphMetadata({
      title,
      description: ogDescription,
      imageUrl: `${SITE_URL}/player/${playerId}/opengraph-image`,
      imageAlt: `Jumpers Heaven ${purePlayerName} Profile`,
      pagePath: `player/${playerId}`,
      imageType: "image/png",
      imageSize: size,
    }),
  };

  return generatedMetadata;
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

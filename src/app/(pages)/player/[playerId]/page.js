import PlayerProfilePanels from "@/components/Pages/PlayerProfile/PlayerProfilePanels";
import { Suspense } from "react";

export const revalidate = 86400; // 1 day

async function PlayerPage({ params }) {
  const { playerId } = await params;

  return (
    <Suspense>
      <PlayerProfilePanels playerId={playerId} />
    </Suspense>
  );
}

export default PlayerPage;

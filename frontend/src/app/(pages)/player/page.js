"use client";

import PlayerProfile from "@/Components/Pages/PlayerProfile/PlayerProfile";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PlayerPageContent = () => {
  const searchParams = useSearchParams();
  const playerId = +searchParams.get("playerid");

  return (
    <main>
      <PlayerProfile playerId={playerId} />
    </main>
  );
};

const PlayerPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerPageContent />
    </Suspense>
  );
};

export default PlayerPage;

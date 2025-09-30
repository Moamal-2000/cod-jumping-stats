import PlayerProfile from "@/Components/Pages/PlayerProfile/PlayerProfile";
import { generatePlayerMetadata } from "@/Functions/utils";

export async function generateMetadata({ params }) {
  const { playerId } = await params;
  return generatePlayerMetadata({ playerId });
}

const PlayerPage = async ({ params }) => {
  const { playerId } = await params;

  return (
    <main>
      <PlayerProfile playerId={playerId} />
    </main>
  );
};

export default PlayerPage;

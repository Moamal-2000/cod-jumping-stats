import PlayerProfile from "@/Components/Pages/PlayerProfile/PlayerProfile";

const PlayerPage = async ({ params }) => {
  const { playerId } = await params;

  return (
    <main>
      <PlayerProfile playerId={playerId} />
    </main>
  );
};

export default PlayerPage;

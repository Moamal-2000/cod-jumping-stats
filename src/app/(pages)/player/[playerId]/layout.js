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
      {!isPlayerIdNumber && (
        <main>Not found</main>
        // <main>
        //   <div className="container">
        //     <section className={s.heroSection}>
        //       <h1>Players Overview</h1>
        //       <p>
        //         Explore all Jumpers Heaven <Link href="/players">players</Link>.
        //         Click on a player to view detailed statistics, performance
        //         history, and records.
        //       </p>
        //     </section>
        //   </div>
        // </main>
      )}

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

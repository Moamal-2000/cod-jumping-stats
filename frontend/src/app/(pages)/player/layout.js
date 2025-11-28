"use client";

import s from "@/components/Pages/PlayerProfile/PlayerLayout.module.scss";
import PlayerProfileLayout from "@/components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PlayerLayout({ children }) {
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerid");
  const isPlayerIdExist = playerId !== null;

  return (
    <>
      {!isPlayerIdExist && (
        <main>
          <div className="container">
            <section className={s.heroSection}>
              <h1>Players Overview</h1>
              <p>
                Explore all Jumpers Heaven <Link href="/players">players</Link>.
                Click on a player to view detailed statistics, performance
                history, and records.
              </p>
            </section>
          </div>
        </main>
      )}

      {isPlayerIdExist && (
        <Suspense fallback={<div>Loading...</div>}>
          <PlayerProfileLayout>{children}</PlayerProfileLayout>
        </Suspense>
      )}
    </>
  );
}

export default PlayerLayout;

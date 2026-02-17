"use client";

import s from "@/components/Pages/PlayerProfile/PlayerLayout.module.scss";
import PlayerProfileLayout from "@/components/Pages/PlayerProfile/PlayerProfileLayout/PlayerProfileLayout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PlayerLayoutContent({ children }) {
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerid");
  const isPlayerIdExist = !isNaN(+playerId);

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

      {isPlayerIdExist && <PlayerProfileLayout>{children}</PlayerProfileLayout>}
    </>
  );
}

export default function PlayerLayout({ children }) {
  return (
    <Suspense>
      <PlayerLayoutContent>{children}</PlayerLayoutContent>
    </Suspense>
  );
}

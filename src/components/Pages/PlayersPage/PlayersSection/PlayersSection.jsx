"use client";

import { DEFAULT_VIEW_MODE } from "@/data/constants";
import { useSearchParams } from "next/navigation";
import PlayerCard from "../PlayerCard/PlayerCard";
import s from "./PlayersSection.module.scss";
import PlayersTable from "./PlayersTable/PlayersTable";

const PlayersSection = ({
  playersScroll,
  allDataDisplayed,
  lastPlayerRef,
  searchByName,
}) => {
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || DEFAULT_VIEW_MODE;

  return (
    <section className={s.playersSection}>
      {viewType === "grid" && (
        <div className={s.playersGrid}>
          {playersScroll.map((player, index) => {
            const ref =
              playersScroll.length === index + 1 ? lastPlayerRef : null;
            return (
              <PlayerCard
                key={player.PlayerID}
                cardRef={ref}
                index={index}
                {...player}
              />
            );
          })}
        </div>
      )}

      {viewType === "list" && (
        <PlayersTable
          playersScroll={playersScroll}
          lastPlayerRef={lastPlayerRef}
        />
      )}

      {allDataDisplayed && playersScroll.length > 0 && !searchByName && (
        <div className={s.endOfResults}>
          <p>You've reached the end of the players list.</p>
        </div>
      )}
    </section>
  );
};

export default PlayersSection;

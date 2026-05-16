"use client";

import { DEFAULT_VIEW_MODE } from "@/data/constants";
import {
  bugHunterIds,
  contentCreators,
  eventWinnerIds,
  mappersIds,
} from "@/data/manualBadges";
import { isActiveWithinWeek } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import PlayerCard from "../PlayerCard/PlayerCard";
import s from "./PlayersSection.module.scss";
import PlayersTable from "./PlayersTable/PlayersTable";

const PlayersSection = ({
  playersData,
  playersScroll,
  allDataDisplayed,
  lastPlayerRef,
  searchByName,
}) => {
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || DEFAULT_VIEW_MODE;

  const badgesCount = {
    winner: eventWinnerIds.length,
    bugHunter: bugHunterIds.length,
    mapper: mappersIds.length,
    creator: contentCreators.length,
    banned: playersData.filter((player) => player.Banned === 1).length,
    donator: playersData.filter((player) => player.Donated === 1).length,
    active: playersData.filter((player) => isActiveWithinWeek(player.LastSeen))
      .length,
    admin: playersData.filter((player) => player.Admin >= 100).length,
  };

  return (
    <section className={s.playersSection}>
      <div className={s.badgesCountContainer}>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Event Winners</span>
          <span className={s.badgeCountValue}>{badgesCount.winner}</span>
        </div>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Bug Hunters</span>
          <span className={s.badgeCountValue}>{badgesCount.bugHunter}</span>
        </div>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Mappers</span>
          <span className={s.badgeCountValue}>{badgesCount.mapper}</span>
        </div>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Content Creators</span>
          <span className={s.badgeCountValue}>{badgesCount.creator}</span>
        </div>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Banned</span>
          <span className={s.badgeCountValue}>{badgesCount.banned}</span>
        </div>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Donators</span>
          <span className={s.badgeCountValue}>{badgesCount.donator}</span>
        </div>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Active</span>
          <span className={s.badgeCountValue}>{badgesCount.active}</span>
        </div>
        <div className={s.badgeCountItem}>
          <span className={s.badgeCountLabel}>Admins</span>
          <span className={s.badgeCountValue}>{badgesCount.admin}</span>
        </div>
      </div>

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

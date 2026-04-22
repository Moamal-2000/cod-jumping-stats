"use client";

import {
  DEFAULT_VIEW_MODE,
  PLAYERS_CARDS_COUNT,
  PLAYERS_LIST_COUNT,
} from "@/data/constants";
import { useSearchParams } from "next/navigation";
import s from "./PlayersSkeletonLoader.module.scss";

const PlayersSkeletonLoader = () => {
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || DEFAULT_VIEW_MODE;

  return (
    <section
      className={s.playersSkeletonSection}
      role="presentation"
      aria-busy="true"
    >
      {viewType === DEFAULT_VIEW_MODE ? (
        <div className={s.playersGrid} aria-hidden="true">
          {Array.from({ length: PLAYERS_CARDS_COUNT }).map((_, index) => (
            <div
              key={index}
              className={s.playerCardSkeleton}
              style={{ ["--pulse-delay"]: `${(index % 3) * 0.25}s` }}
            >
              <div className={s.topSection}>
                <div className={s.cardHeader}>
                  <div className={s.avatar} />

                  <div className={s.identityBlock}>
                    <div className={`${s.skeleton} ${s.nameLine}`} />
                    <div className={`${s.skeleton} ${s.idAndAdminLine}`} />
                  </div>

                  <div className={`${s.skeleton} ${s.favButton}`} />
                </div>

                <div className={s.badges}>
                  <div className={`${s.skeleton} ${s.badgeLine}`} />
                  <div className={`${s.skeleton} ${s.badgeLine}`} />
                </div>
              </div>

              <div className={s.statsGrid}>
                <div className={`${s.skeleton} ${s.visitsLine}`} />
                <div className={`${s.skeleton} ${s.lastSeenLine}`} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.tableSkeletonWrapper} aria-hidden="true">
          <table className={s.playersTableSkeleton}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Visits</th>
                <th>Last Seen</th>
                <th>Badges</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: PLAYERS_LIST_COUNT }).map((_, index) => (
                <tr
                  key={index}
                  style={{ ["--pulse-delay"]: `${(index % 4) * 0.2}s` }}
                >
                  <td>
                    <div className={s.playerInfoWrapper}>
                      <div className={s.avatar} />
                      <div className={s.identityBlock}>
                        <div className={`${s.skeleton} ${s.nameLine}`} />
                        <div className={`${s.skeleton} ${s.nameLine}`} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`${s.skeleton} ${s.visitsLine}`} />
                  </td>
                  <td>
                    <div className={`${s.skeleton} ${s.lastSeenLine}`} />
                  </td>
                  <td>
                    <div className={s.badgeRow}>
                      <div className={`${s.skeleton} ${s.badge}`} />
                      <div className={`${s.skeleton} ${s.badge}`} />
                      <div className={`${s.skeleton} ${s.badge}`} />
                      <div className={`${s.skeleton} ${s.badge}`} />
                      <div className={`${s.skeleton} ${s.badge}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default PlayersSkeletonLoader;

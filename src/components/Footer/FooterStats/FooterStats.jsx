"use client";

import { useGetJhStatsQuery } from "@/redux/features/jhStats/api/jhStatsSlice";
import s from "./FooterStats.module.scss";

const FooterStats = () => {
  const jhStatsQuery = useGetJhStatsQuery();
  const jhStats = jhStatsQuery.data;

  return (
    <section className={s.statsSection}>
      <div className={s.dateWrapper}>
        <div className={s.iconHolder}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#timer" />
          </svg>
        </div>

        <div className={s.info}>
          <p className={s.title}>We last updated the site data on:</p>
          <p className={s.date}>Update date currently unavailable</p>
        </div>
      </div>

      <div className={s.statsWrapper}>
        <div className={s.stat}>
          <b className={s.number}>???</b>
          <span className={s.title}>Players</span>
        </div>

        <div className={s.stat}>
          <b className={s.number}>{jhStats?.mapsCount || "???"}</b>
          <span className={s.title}>Maps</span>
        </div>

        <div className={s.stat}>
          <b className={s.number}>???</b>
          <span className={s.title}>Records</span>
        </div>
      </div>
    </section>
  );
};

export default FooterStats;

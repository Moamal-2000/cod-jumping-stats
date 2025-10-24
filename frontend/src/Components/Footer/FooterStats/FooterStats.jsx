"use client";

import { getJumpersHeavenStats } from "@/Redux/slices/globalSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./FooterStats.module.scss";

const FooterStats = () => {
  const dispatch = useDispatch();
  const { statistics } = useSelector((s) => s.global);

  useEffect(() => {
    dispatch(getJumpersHeavenStats());
  }, []);

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
          <p className={s.date}>April 2, 2025 at 08:45 GMT</p>
        </div>
      </div>

      <div className={s.statsWrapper}>
        <div className={s.stat}>
          <b className={s.number}>???</b>
          <span className={s.title}>Players</span>
        </div>

        <div className={s.stat}>
          <b className={s.number}>{statistics?.mapsCount || "???"}</b>
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

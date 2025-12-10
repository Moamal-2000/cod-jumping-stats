"use client";

import s from "./HeroSection.module.scss";

/**
 * Hero section for the Favorites page.
 * Provides context about the page purpose and displays favorite counts.
 *
 * @param {Object} props
 * @param {number} props.mapsCount - Number of favorite maps
 * @param {number} props.playersCount - Number of favorite players
 */
const HeroSection = ({ mapsCount = 0, playersCount = 0 }) => {
  const totalFavorites = mapsCount + playersCount;

  return (
    <section className={s.hero}>
      <div className={s.content}>
        <div className={s.iconWrapper}>
          <svg className={s.icon} aria-hidden="true">
            <use href="/icons-sprite.svg#heart" />
          </svg>
        </div>

        <h1 className={s.title}>Your Favorites</h1>
        <p className={s.description}>
          Keep track of your favorite maps and players all in one place. Quick
          access to everything you love.
        </p>

        <div className={s.stats}>
          <div className={s.stat}>
            <svg className={s.statIcon} aria-hidden="true">
              <use href="/icons-sprite.svg#map" />
            </svg>
            <span className={s.statValue}>{mapsCount}</span>
            <span className={s.statLabel}>Maps</span>
          </div>

          <div className={s.divider} />

          <div className={s.stat}>
            <svg className={s.statIcon} aria-hidden="true">
              <use href="/icons-sprite.svg#users" />
            </svg>
            <span className={s.statValue}>{playersCount}</span>
            <span className={s.statLabel}>Players</span>
          </div>

          <div className={s.divider} />

          <div className={s.stat}>
            <svg className={s.statIcon} aria-hidden="true">
              <use href="/icons-sprite.svg#star" />
            </svg>
            <span className={s.statValue}>{totalFavorites}</span>
            <span className={s.statLabel}>Total</span>
          </div>
        </div>
      </div>

      <div className={s.backgroundGlow} aria-hidden="true" />
    </section>
  );
};

export default HeroSection;

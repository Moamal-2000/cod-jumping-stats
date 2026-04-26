"use client";

import FpsButtons from "@/components/Shared/Buttons/FpsButtons/FpsButtons";
import { JUMP_FPS } from "@/data/constants";
import { getFpsDifficultyValue } from "@/lib/utils";
import s from "./MapDetailInfo.module.scss";

const MapDetailInfo = ({ mapData }) => {
  const Difficulty = mapData?.Difficulty;
  const hasDifficulty = mapHasDifficulties(Difficulty);

  return (
    <div className={s.infoCard}>
      <div className={s.cardHeader}>
        <h2>Map Information</h2>
        <FpsButtons options={["all", ...JUMP_FPS, "mix"]} />
      </div>

      <div className={s.difficultySection}>
        <h3>Difficulty</h3>

        {hasDifficulty && (
          <div className={s.difficultyGrid}>
            {JUMP_FPS.map((fps) => {
              const fpsDifficulty = getFpsDifficultyValue({ fps, Difficulty });

              if (fpsDifficulty === "?") {
                return null;
              }

              return (
                <div key={fps} className={s.difficultyItem}>
                  <span className={s.fpsLabel}>{fps} FPS</span>
                  <span className={s.difficultyValue}>{fpsDifficulty}</span>
                </div>
              );
            })}
          </div>
        )}

        {!hasDifficulty && (
          <div className={s.noDifficulty}>
            <p>No difficulty data available for this map</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDetailInfo;

function mapHasDifficulties(Difficulty) {
  return JUMP_FPS.some(
    (fps) => getFpsDifficultyValue({ fps, Difficulty }) !== "?",
  );
}

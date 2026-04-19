"use client";

import { normalizeFpsQuery } from "@/components/Footer/formatting";
import { JUMP_FPS } from "@/data/constants";
import { createQueryString } from "@/lib/queryParams";
import { getFpsDifficultyValue } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./MapDetailInfo.module.scss";

const fpsOptions = ["All", "125", "250", "333", "43", "76", "mix"];

const MapDetailInfo = ({ mapData }) => {
  const Difficulty = mapData?.Difficulty;
  const hasDifficulty = mapHasDifficulties(Difficulty);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedFps = normalizeFpsQuery(searchParams.get("fps"));

  function handleFpsChange(nextFps) {
    const normalizedFps = normalizeFpsQuery(nextFps);
    if (normalizedFps === selectedFps) {
      return;
    }

    createQueryString("fps", normalizedFps, searchParams, router, pathname);
  }

  return (
    <div className={s.infoCard}>
      <div className={s.cardHeader}>
        <h2>Map Information</h2>
        <div className={s.fpsSelector}>
          <span className={s.fpsLabel}>FPS:</span>
          <div className={s.fpsButtons}>
            {fpsOptions.map((fps) => (
              <button
                key={fps}
                className={`${s.fpsButton} ${
                  selectedFps === fps ? s.active : ""
                }`}
                onClick={() => handleFpsChange(fps)}
              >
                {fps === "mix" ? "Mixed" : fps}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.difficultySection}>
        <h3>Difficulty</h3>
        {hasDifficulty ? (
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
        ) : (
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

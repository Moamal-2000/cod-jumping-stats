import { JUMP_FPS } from "@/Data/constants";
import s from "./MapDetailInfo.module.scss";

const fpsOptions = ["All", "125", "250", "333", "43", "76", "mix"];

const MapDetailInfo = ({ mapData, selectedFps, onFpsChange }) => {
  const { Difficulty } = mapData;

  const getDifficultyValue = (fps) => {
    const diff = Difficulty?.[fps];
    if (!diff || diff.Difficulty < 0) return "?";
    return Number(diff.Difficulty).toFixed(2);
  };

  const getStatsForFps = (fps) => {
    const diff = Difficulty?.[fps];
    if (!diff || diff.Difficulty < 0) return null;
    return diff;
  };

  const currentStats = getStatsForFps(selectedFps);
  const hasDifficulty = JUMP_FPS.some((fps) => getDifficultyValue(fps) !== "?");

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
                onClick={() => onFpsChange(fps)}
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
              const fpsDifficulty = getDifficultyValue(fps);

              if (fpsDifficulty === "?") return null;

              return (
                <div key={fps} className={s.difficultyItem}>
                  <span className={s.fpsLabel}>
                    {fps === "mix" ? "Mixed" : fps} FPS
                  </span>
                  <span className={s.difficultyValue}>
                    {getDifficultyValue(fps)}
                  </span>
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

      {/* Hide, until dcoy fix it */}
      {currentStats && selectedFps !== "All" && true === false && (
        <div className={s.statsSection}>
          <h3>Statistics ({selectedFps} FPS)</h3>
          <div className={s.statsGrid}>
            <div className={s.statItem}>
              <span className={s.statLabel}>Number of Tops</span>
              <span className={s.statValue}>{currentStats.NbTops}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDetailInfo;

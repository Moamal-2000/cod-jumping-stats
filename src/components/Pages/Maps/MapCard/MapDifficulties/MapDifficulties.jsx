import { JUMP_FPS } from "@/data/constants";
import { getFpsDifficultyValue } from "@/lib/utils";
import s from "./MapDifficulties.module.scss";

const MapDifficulties = ({ Difficulty }) => {
  return (
    <div className={s.difficultySection}>
      <span className={s.difficultyLabel}>Difficulties</span>

      <div className={s.fpsDifficulties}>
        {JUMP_FPS.map((fps) => {
          const fpsDifficulty = getFpsDifficultyValue({ fps, Difficulty });

          if (fpsDifficulty === "?") return null;

          return (
            <div key={fps} className={s.fpsDifficulty}>
              <span className={s.fps}>{fps}</span>
              <span className={s.difficulty}>{fpsDifficulty}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapDifficulties;

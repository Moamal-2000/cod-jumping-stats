import MapImage from "@/components/Shared/Images/MapImage/MapImage";
import { JUMP_FPS } from "@/data/constants";
import { formateReleaseDate, getMapCompletionRate } from "@/functions/utils";
import Link from "next/link";
import { memo } from "react";
import s from "./MapCard2.module.scss";

const MapCard2 = ({ mapData, mapsScroll, allMaps, lastMapRef, index }) => {
  const {
    Author,
    Name,
    Classifications,
    Difficulty,
    IndividualFinishCount,
    Released,
    Videos,
    Ender,
    CpID,
  } = mapData;
  const ref = mapsScroll.length === index + 1 ? lastMapRef : null;
  const completionRate = getMapCompletionRate({
    allMaps,
    IndividualFinishCount,
  });

  return (
    <div className={s.mapCard} ref={ref}>
      <Link href={`/map?mapid=${CpID}`} className={s.imgHolder}>
        <MapImage mapName={Name} />
      </Link>

      <div className={s.leftSide}>
        <Link href={`/map?mapid=${CpID}`}>
          <span className={s.name}>
            {Name}
            {Ender && <span className={s.ender}>({Ender})</span>}
          </span>
          {Videos?.length > 0 && (
            <span className={s.videoIcon}>
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#youtube" />
              </svg>
            </span>
          )}
        </Link>

        <div className={s.difficultySection}>
          <span className={s.difficultyLabel}>Difficulties</span>
          <div className={s.fpsDifficulties}>
            {JUMP_FPS.map((fps) => {
              return (
                <div key={fps} className={s.fpsDifficulty}>
                  <span className={s.fps}>{fps}</span>
                  <span className={s.difficulty}>
                    {Difficulty?.[fps]?.Difficulty < 0
                      ? "???"
                      : Number(Difficulty?.[fps]?.Difficulty)?.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={s.classifications}>
          {Classifications?.map((text, index) => (
            <span className={`${s.classification} ${s[text]}`} key={index}>
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className={s.rightSide}>
        <div className={s.completionRate}>
          <div className={s.textWrapper}>
            <span className={s.text}>Completion Rate</span>
            <span className={s.rate}>{completionRate + "%"}</span>
          </div>

          <div className={s.progressBar}>
            <div className={s.progressLine} />
            <div
              className={s.hideLine}
              style={{
                left: completionRate + "%",
                width: 100 - completionRate + "%",
              }}
            />
          </div>
        </div>

        <div className={s.authorAndRelease}>
          <span className={s.authorName}>{Author}</span>
          <span className={s.releaseDate}>{formateReleaseDate(Released)}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(MapCard2);

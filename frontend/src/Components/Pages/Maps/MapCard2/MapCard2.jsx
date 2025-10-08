import MapImage from "@/Components/Shared/Images/MapImage/MapImage";
import { formateReleaseDate, openVideo } from "@/Functions/utils";
import Link from "next/link";
import { memo } from "react";
import s from "./MapCard2.module.scss";

const MapCard2 = memo(({ mapData, mapsScroll, lastMapRef, index }) => {
  const {
    Author,
    Name,
    Classifications,
    Difficulty,
    CompilationRate,
    Released,
    Videos,
    Ender,
    CpID,
  } = mapData;
  const ref = mapsScroll.length === index + 1 ? lastMapRef : null;

  return (
    <Link href={`/map/${CpID}`} className={s.mapCardLink}>
      <div className={s.mapCard} ref={ref}>
        <div className={s.imgHolder}>
          <MapImage mapName={Name} />
        </div>

        <div className={s.leftSide}>
          <div className={s.nameSection}>
            <span className={s.mapName}>
              {Name}
              {Ender && <span className={s.enderValue}> ({Ender})</span>}
            </span>

            {Videos?.length > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openVideo(Videos, 0);
                }}
                className={s.videoIcon}
                title="Open video"
              >
                <svg>
                  <use href="/badgesIcons.svg#youtube" />
                </svg>
              </button>
            )}
          </div>

          <div className={s.difficultySection}>
            <span className={s.difficultyLabel}>Difficulties</span>
            <div className={s.fpsDifficulties}>
              {Difficulty?.[125] && (
                <div className={s.fpsDifficulty}>
                  <span className={s.fps}>125</span>
                  <span className={s.difficulty}>
                    {Difficulty[125].Difficulty < 0
                      ? "?"
                      : Number(Difficulty[125].Difficulty).toFixed(2)}
                  </span>
                </div>
              )}
              {Difficulty?.[250] && (
                <div className={s.fpsDifficulty}>
                  <span className={s.fps}>250</span>
                  <span className={s.difficulty}>
                    {Difficulty[250].Difficulty < 0
                      ? "?"
                      : Number(Difficulty[250].Difficulty).toFixed(2)}
                  </span>
                </div>
              )}
              {Difficulty?.[333] && (
                <div className={s.fpsDifficulty}>
                  <span className={s.fps}>333</span>
                  <span className={s.difficulty}>
                    {Difficulty[333].Difficulty < 0
                      ? "?"
                      : Number(Difficulty[333].Difficulty).toFixed(2)}
                  </span>
                </div>
              )}
              {Difficulty?.[43] && (
                <div className={s.fpsDifficulty}>
                  <span className={s.fps}>43</span>
                  <span className={s.difficulty}>
                    {Difficulty[43].Difficulty < 0
                      ? "?"
                      : Number(Difficulty[43].Difficulty).toFixed(2)}
                  </span>
                </div>
              )}
              {Difficulty?.[76] && (
                <div className={s.fpsDifficulty}>
                  <span className={s.fps}>76</span>
                  <span className={s.difficulty}>
                    {Difficulty[76].Difficulty < 0
                      ? "?"
                      : Number(Difficulty[76].Difficulty).toFixed(2)}
                  </span>
                </div>
              )}
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
          <div className={s.authorAndRelease}>
            <span className={s.authorName}>{Author}</span>
            <span className={s.releaseDate}>
              {formateReleaseDate(Released)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

MapCard2.displayName = "MapCard2";

export default MapCard2;

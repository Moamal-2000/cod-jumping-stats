import MapImage from "@/Components/Shared/Images/MapImage/MapImage";
import { JUMP_FPS } from "@/Data/constants";
import Link from "next/link";
import { memo } from "react";
import AuthorAndRelease from "./AuthorAndRelease/AuthorAndRelease";
import s from "./MapCard.module.scss";

const MapCard = memo(({ mapData, mapsScroll, lastMapRef, index }) => {
  const {
    Author,
    Difficulty,
    Name,
    Classifications,
    Rate,
    CompilationRate,
    Released,
    Videos,
  } = mapData;
  const ref = mapsScroll.length === index + 1 ? lastMapRef : null;

  return (
    <div className={s.mapCard} ref={ref}>
      <div className={s.imgHolder}>
        <MapImage mapName={Name} />

        <div className={s.layer}>
          <div className={s.classifications}>
            {Classifications?.map((text, index) => (
              <span className={`${s.classification} ${s[text]}`} key={index}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className={s.content}>
        <div className={s.nameAndRating}>
          <Link href="/maps/map/details">
            {Name}
            {Videos?.length > 0 && (
              <span className={s.videoIcon}>
                <svg>
                  <use href="/icons-sprite.svg#youtube" />
                </svg>
              </span>
            )}
          </Link>

          <div className={s.rateWrapper}>
            <span className={s.star}>★</span>
            <span className={s.rate}>{Rate ? Rate : "?"}</span>
          </div>
        </div>

        <div className={s.difficultySection}>
          <span className={s.difficultyLabel}>Difficulties</span>
          <div className={s.fpsDifficulties}>
            {JUMP_FPS.map((fps) => {
              return (
                <div className={s.fpsDifficulty}>
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

        <div className={s.completionRate}>
          <div className={s.textWrapper}>
            <span className={s.text}>Completion Rate</span>
            <span className={s.rate}>{CompilationRate || 0 + "%"}</span>
          </div>

          <div className={s.progressBar}>
            <div
              className={s.progressLine}
              style={{ width: CompilationRate || 0 + "%" }}
            />
          </div>
        </div>

        <AuthorAndRelease author={Author} release={Released} />
      </section>
    </div>
  );
});

export default MapCard;

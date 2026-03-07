import s from "./SkeletonMapCard.module.scss";

const SkeletonMapCard = () => {
  return (
    <div className={s.card} role="presentation">
      <div className={`${s.skeleton} ${s.mapImage}`} />

      <div className={s.content}>
        <div className={s.nameAndRating}>
          <div className={`${s.skeleton} ${s.mapName}`} />
          <div className={`${s.skeleton} ${s.circle}`} />
        </div>

        <div className={`${s.skeleton} ${s.tinyLine}`} />

        <div className={s.difficulties}>
          <div className={s.skeleton} />
          <div className={s.skeleton} />
          <div className={s.skeleton} />
          <div className={s.skeleton} />
        </div>

        <div className={`${s.skeleton} ${s.line}`} />

        <div className={s.authorAndRelease}>
          <div className={`${s.skeleton} ${s.tinyLine} ${s.author}`} />
          <div className={`${s.skeleton} ${s.releaseBox}`} />
        </div>
      </div>
    </div>
  );
};
export default SkeletonMapCard;

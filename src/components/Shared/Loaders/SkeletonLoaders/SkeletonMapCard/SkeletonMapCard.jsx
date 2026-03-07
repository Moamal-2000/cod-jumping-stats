import s from "./SkeletonMapCard.module.scss";

const SkeletonMapCard = () => {
  return (
    <div className={s.gridSkeletonCard} role="presentation">
      <div className={`${s.skeletonBox} ${s.gridImage}`} />

      <div className={s.gridBody}>
        <div className={s.gridTopRow}>
          <div className={`${s.skeletonBox} ${s.gridTitle}`} />
          <div className={`${s.skeletonBox} ${s.gridCircle}`} />
        </div>

        <div className={`${s.skeletonBox} ${s.gridLineTiny}`} />

        <div className={s.difficulties}>
          <div className={`${s.skeletonBox} ${s.gridTag}`} />
          <div className={`${s.skeletonBox} ${s.gridTag}`} />
          <div className={`${s.skeletonBox} ${s.gridTag}`} />
          <div className={`${s.skeletonBox} ${s.gridTag}`} />
        </div>

        <div className={`${s.skeletonBox} ${s.gridLine}`} />

        <div className={s.authorAndRelease}>
          <div className={`${s.skeletonBox} ${s.gridLineTiny} ${s.author}`} />
          <div className={`${s.skeletonBox} ${s.releaseBox}`} />
        </div>
      </div>
    </div>
  );
};
export default SkeletonMapCard;

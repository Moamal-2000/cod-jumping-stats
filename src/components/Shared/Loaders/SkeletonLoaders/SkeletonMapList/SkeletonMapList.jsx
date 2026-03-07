import s from "./SkeletonMapList.module.scss";

const SkeletonMapList = () => {
  return (
    <div className={s.map} role="presentation">
      <div className={`${s.skeleton} ${s.mapImage}`} />

      <div className={s.leftSide}>
        <div className={`${s.skeleton} ${s.mapName}`} />

        <div className={s.difficulties}>
          <div className={`${s.skeleton} ${s.listTag}`} />
          <div className={`${s.skeleton} ${s.listTag}`} />
          <div className={`${s.skeleton} ${s.listTag}`} />
        </div>

        <div className={s.classifications}>
          <div className={s.skeleton} />
          <div className={s.skeleton} />
        </div>
      </div>

      <div className={s.rightSide}>
        <div className={s.completionRate}>
          <div className={s.wrapper}>
            <div className={`${s.skeleton} ${s.label}`} />
            <div className={`${s.skeleton} ${s.value}`} />
          </div>

          <div className={`${s.skeleton} ${s.progressBar}`} />
        </div>

        <div className={s.authorAndRelease}>
          <div className={`${s.skeleton} ${s.author}`} />
          <div className={`${s.skeleton} ${s.release}`} />
        </div>
      </div>
    </div>
  );
};
export default SkeletonMapList;

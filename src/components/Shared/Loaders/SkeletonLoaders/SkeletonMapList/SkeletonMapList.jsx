import s from "./SkeletonMapList.module.scss";

const SkeletonMapList = () => {
  return (
    <article className={s.listSkeletonCard}>
      <div className={`${s.skeletonBox} ${s.listImage}`} />

      <div className={s.listMain}>
        <div className={`${s.skeletonBox} ${s.listTitle}`} />

        <div className={s.listTags}>
          <div className={`${s.skeletonBox} ${s.listTag}`} />
          <div className={`${s.skeletonBox} ${s.listTag}`} />
          <div className={`${s.skeletonBox} ${s.listTag}`} />
        </div>

        <div className={`${s.skeletonBox} ${s.listLine}`} />
      </div>

      <div className={s.listMeta}>
        <div className={`${s.skeletonBox} ${s.listLine}`} />
        <div className={`${s.skeletonBox} ${s.listLineShort}`} />
      </div>
    </article>
  );
};
export default SkeletonMapList;

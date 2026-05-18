import s from "./SkeletonCard.module.scss";

const SkeletonCard = () => {
  return (
    <div className={s.skeletonCard} role="presentation">
      <div className={s.header}>
        <div className={s.flag} />
        <div className={s.serverInfo}>
          <div className={`${s.ip} ${s.line} ${s.short}`} />
          <div className={`${s.line} ${s.shorter}`} />
        </div>

        <div className={s.wrapper}>
          <div className={`${s.line} ${s.statusIndicator}`} />
          <div className={`${s.line} ${s.joinServerButton}`} />
        </div>
      </div>

      <div className={s.mapInfo}>
        <div className={s.info}>
          <div className={`${s.line} ${s.tiny}`} />
          <div className={`${s.line} ${s.mini}`} />
        </div>
        <div className={s.info}>
          <div className={`${s.line} ${s.tiny}`} />
          <div className={`${s.line} ${s.mini}`} />
        </div>
      </div>

      <div className={s.players}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={s.line} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;

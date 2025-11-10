import s from "./CompletionRate.module.scss";

const CompletionRate = ({ completionRate }) => {
  return (
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
  );
};

export default CompletionRate;

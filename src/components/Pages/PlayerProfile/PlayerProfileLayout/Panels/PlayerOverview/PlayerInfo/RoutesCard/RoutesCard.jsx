import s from "./RoutesCard.module.scss";

const RoutesCard = ({ performanceStats }) => {
  const completionRatio = (performanceStats?.MapsCompletedRatio || 0) * 100;
  const totalMapsCompleted =
    performanceStats?.TotalMapsCompleted?.toLocaleString() || "0";

  return (
    <div className={s.card}>
      <div className={s.infoLabel}>
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#flag"></use>
        </svg>
        Routes Completed
      </div>

      <div className={s.infoValue}>{totalMapsCompleted}</div>

      <h2 className={s.infoSubtext}>
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#check-circle"></use>
        </svg>
        {Math.round(completionRatio)}% completion rate
      </h2>

      <div className={s.progressBar} role="progressbar">
        <div
          className={`${s.progressBarFill} ${getCompletionRateClass(completionRatio)}`}
          style={{ width: `${completionRatio}%` }}
        />
      </div>
    </div>
  );
};

export default RoutesCard;

function getCompletionRateClass(completionRate) {
  if (completionRate >= 95) return s[`highlight-95`];
  if (completionRate >= 70) return s[`highlight-70`];
  if (completionRate >= 50) return s[`highlight-50`];
  if (completionRate >= 25) return s[`highlight-25`];

  return "";
}

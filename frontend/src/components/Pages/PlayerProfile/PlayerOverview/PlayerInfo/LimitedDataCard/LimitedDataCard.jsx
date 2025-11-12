import s from "./LimitedDataCard.module.scss";

const LimitedDataCard = () => {
  return (
    <div className={s.card}>
      <div className={s.title}>
        <svg aria-hidden="true">
          <use href="/icons-sprite.svg#chart-bar"></use>
        </svg>
        Player Data
      </div>

      <h2 className={s.infoTitle}>Limited Data Available</h2>

      <p className={s.infoSubtext}>
        This player has insufficient data for detailed statistics
      </p>
    </div>
  );
};

export default LimitedDataCard;

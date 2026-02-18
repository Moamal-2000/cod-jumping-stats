import s from "./EmptyGraphState.module.scss";

const EmptyGraphState = () => {
  return (
    <div className={s.graphContainer}>
      <div className={s.emptyState}>
        <svg>
          <use href="/icons-sprite.svg#message" />
        </svg>
        <p>No run data available for the selected map</p>
      </div>
    </div>
  );
};

export default EmptyGraphState;

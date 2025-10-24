import s from "./ExpandTopStatBtn.module.scss";

const ExpandTopStatBtn = ({ showMoreStats, setShowMoreStats }) => {
  const activeClass = showMoreStats ? s.active : "";

  function handleExpandTopsStat() {
    setShowMoreStats((prevValue) => !prevValue);
  }

  return (
    <button
      type="button"
      onClick={handleExpandTopsStat}
      className={`${s.expandButton} ${activeClass}`}
      aria-label="Expand stats bars"
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#right-arrow" />
      </svg>
    </button>
  );
};

export default ExpandTopStatBtn;

import s from "./ToggleButton.module.scss";

const ToggleButton = ({ handleToggle, disabled }) => {
  return (
    <button
      type="button"
      aria-label="Toggle options"
      onClick={handleToggle}
      disabled={disabled}
      className={s.toggleButton}
      data-type="toggle-button"
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#solid-arrow" />
      </svg>
    </button>
  );
};

export default ToggleButton;

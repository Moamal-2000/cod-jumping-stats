import s from "./ClearButton.module.scss";

const ClearButton = ({
  label,
  handleClear,
  disabled,
  inputValue,
  ref,
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClear}
      disabled={disabled || inputValue === ""}
      className={`${s.clearButton} ${inputValue === "" ? s.hide : ""}`}
      ref={ref}
      aria-hidden={inputValue === ""}
      tabIndex={inputValue === "" ? -1 : 0}
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#xMark" />
      </svg>
    </button>
  );
};

export default ClearButton;

import s from "./ClearButton.module.scss";

const ClearButton = ({
  className,
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
      className={`${className} ${s.clearButton} ${inputValue === "" ? s.hide : ""}`}
      ref={ref}
      aria-hidden={inputValue === ""}
      tabIndex={inputValue === "" ? -1 : 0}
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#x-mark" />
      </svg>
    </button>
  );
};

export default ClearButton;

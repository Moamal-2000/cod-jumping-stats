import s from "./LegendLabel.module.scss";

const LegendLabel = ({ label, tooltipText }) => {
  return (
    <legend className={s.label} data-label={label}>
      {label}
      <div className={s.tooltip}>
        <div className={s.icon}>
          <svg aria-hidden="true">
            <use href="/icons-sprite.svg#question-mark" />
          </svg>
        </div>

        <p className={s.tooltipText}>{tooltipText}</p>
      </div>
    </legend>
  );
};

export default LegendLabel;

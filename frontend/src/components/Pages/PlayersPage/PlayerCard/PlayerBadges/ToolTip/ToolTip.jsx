import s from "./ToolTip.module.scss";

const ToolTip = ({ children }) => {
  return (
    <div
      className={s.customTooltip}
      role="tooltip"
      aria-hidden="true"
      data-tooltip
    >
      {children}
    </div>
  );
};

export default ToolTip;

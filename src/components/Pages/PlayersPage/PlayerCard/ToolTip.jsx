import s from "./ToolTip.module.scss";

const ToolTip = ({ children, centerPosition = false, bottom }) => {
  return (
    <div
      className={`${s.customTooltip} ${centerPosition ? s.center : ""}`}
      role="tooltip"
      aria-hidden="true"
      data-tooltip
      style={{ bottom }}
    >
      {children}
    </div>
  );
};

export default ToolTip;

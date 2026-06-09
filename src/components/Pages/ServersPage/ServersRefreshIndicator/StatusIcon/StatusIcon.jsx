import AnimatedSpinnerIcon from "@/components/Shared/Loaders/SpinnerLoader/AnimatedSpinnerIcon";
import s from "./StatusIcon.module.scss";

const StatusIcon = ({ refreshStage, isError }) => {
  if (refreshStage === "before") {
    return (
      <div className={s.iconWrapper}>
        <AnimatedSpinnerIcon />
      </div>
    );
  }

  return (
    <div className={s.iconWrapper}>
      {isError && (
        <svg className={s.errorIcon} viewBox="0 0 384 512">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      )}

      {!isError && (
        <svg className={s.checkedIcon} viewBox="0 0 448 512">
          <path d="M439 105c12 13 12 33 0 46L183 407a32 32 0 0 1-46 0L9 279a32 32 0 0 1 46-46l105 106 233-234c13-12 33-12 46 0z" />
        </svg>
      )}
    </div>
  );
};
export default StatusIcon;

import AnimatedSpinnerIcon from "./AnimatedSpinnerIcon.jsx";
import s from "./SpinnerLoader.module.scss";

const SpinnerLoader = ({ title, description, type }) => {
  if (type === "table") {
    return (
      <tr className={s.loader} data-loader>
        <td>
          <AnimatedSpinnerIcon />
          <b className={s.title}>{title}</b>
          <p className={s.description}>{description}</p>
        </td>
      </tr>
    );
  }

  return (
    <div className={s.loader} data-loader>
      <AnimatedSpinnerIcon />
      <b className={s.title}>{title}</b>
      <p className={s.description}>{description}</p>
    </div>
  );
};

export default SpinnerLoader;

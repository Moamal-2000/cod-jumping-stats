import s from "./LoadingRadar.module.scss";

const LoadingRadar = () => (
  <svg className={s.loading} viewBox="0 0 24 24">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 14.9 3.26 17.46 5.25 19.19L12 12.44V2Z"
      fill="currentColor"
    />
  </svg>
);

export default LoadingRadar;

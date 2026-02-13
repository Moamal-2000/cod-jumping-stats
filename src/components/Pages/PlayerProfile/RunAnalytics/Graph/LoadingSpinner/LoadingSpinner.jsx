import s from "./LoadingSpinner.module.scss";

const LoadingSpinner = () => (
  <svg className={s.spinner} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.2"
    />
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 14.9 3.26 17.46 5.25 19.19L12 12.44V2Z"
      fill="currentColor"
    />
  </svg>
);

export default LoadingSpinner;

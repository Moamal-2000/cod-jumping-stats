import LoadingSpinner from "./LoadingRadar/LoadingRadar";
import s from "./LoadingUI.module.scss";

const LoadingUI = () => {
  return (
    <div className={s.graphContainer}>
      <div className={s.loadingState}>
        <LoadingSpinner />
        <p>Loading graph data...</p>
      </div>
    </div>
  );
};

export default LoadingUI;

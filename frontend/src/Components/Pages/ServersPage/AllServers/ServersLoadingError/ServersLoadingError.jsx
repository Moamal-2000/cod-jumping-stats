import SkeletonCard from "../SkeletonCard/SkeletonCard";
import s from "./ServersLoadingError.module.scss";

const ServersLoadingError = ({ loading, error }) => {
  if (loading) {
    return (
      <>
        <div className={s.serversGrid}>
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className={s.serversGrid}>
          {[...Array(11)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className={s.errorContainer}>
        <h3>Server Status Unavailable</h3>
        <p>{error}</p>
      </div>
    );
  }
};

export default ServersLoadingError;

import s from "./PlayersLoadingError.module.scss";

const PlayersLoadingError = ({ error, dispatch }) => {
  if (error) {
    return (
      <div className={s.errorContainer}>
        <h2>Error Loading Players</h2>
        <p>Unable to fetch players data. Please try again later.</p>
        <button
          onClick={() => {
            dispatch(resetPagination());
            dispatch(fetchAllPlayers());
          }}
          className={s.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={s.loadingContainer}>
      <div className={s.loadingSpinner}></div>
      <p>Loading players...</p>
    </div>
  );
};

export default PlayersLoadingError;

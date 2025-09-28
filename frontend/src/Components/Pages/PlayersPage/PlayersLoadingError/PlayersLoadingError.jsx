import s from "./PlayersLoadingError.module.scss";

const PlayersLoadingError = ({ loading, dispatch, sortBy }) => {
  if (loading) {
    return (
      <div className={s.loadingContainer}>
        <div className={s.loadingSpinner}></div>
        <p>Loading players...</p>
      </div>
    );
  }

  return (
    <div className={s.errorContainer}>
      <h2>Error Loading Players</h2>
      <p>Unable to fetch players data. Please try again later.</p>
      <button
        onClick={() => {
          dispatch(resetPagination());
          dispatch(fetchAllPlayers({ sort: sortBy }));
        }}
        className={s.retryButton}
      >
        Retry
      </button>
    </div>
  );
};

export default PlayersLoadingError;

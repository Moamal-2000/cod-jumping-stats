import { resetPagination } from "@/redux/features/players/slice/playersSlice";
import { fetchAllPlayers } from "@/redux/features/players/thunk/playersThunk";
import s from "./PlayersError.module.scss";

const PlayersError = ({ error, dispatch }) => {
  if (!error) return null;

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
};

export default PlayersError;

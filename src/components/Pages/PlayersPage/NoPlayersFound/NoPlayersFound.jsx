import s from "./NoPlayersFound.module.scss";

const NoPlayersFound = ({ handleClearSearch }) => {
  return (
    <section className={s.notFoundSection}>
      <div className={s.noResults}>
        <h3>No players found</h3>
        <p>No players match your search criteria.</p>

        <button
          type="button"
          className={s.clearSearchButton}
          onClick={handleClearSearch}
        >
          Clear search
        </button>
      </div>
    </section>
  );
};

export default NoPlayersFound;

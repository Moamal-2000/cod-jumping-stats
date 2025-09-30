import s from "./NoPlayersFound.module.scss";

const NoPlayersFound = ({ noResults, searchTerm, handleClearSearch }) => {
  if (!noResults) return null;

  const description = searchTerm
    ? `No players match "${searchTerm}"`
    : "No players available at the moment";

  return (
    <section className={s.notFoundSection}>
      <div className={s.noResults}>
        <h3>No players found</h3>
        <p>{description}</p>

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

import SelectFpsButtons from "./SelectFpsButtons/SelectFpsButtons";
import s from "./TopRunsOptions.module.scss";

const TopRunsOptions = ({
  rankFilter,
  setRankFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className={s.topRunsControls}>
      <div className={s.fpsToggleGroup}>
        <label>Filter By FPS:</label>
        <SelectFpsButtons />
      </div>

      <div className={s.controlGroup}>
        <label htmlFor="rank-filter">Rank Filter:</label>
        <select
          id="rank-filter"
          value={rankFilter}
          onChange={(e) => setRankFilter(e.target.value)}
          className={s.rankSelect}
        >
          <option value="1">Top 1 Only</option>
          <option value="1-10">Top 1-10</option>
          <option value="all">All Ranks</option>
        </select>
      </div>

      <div className={s.controlGroup}>
        <label htmlFor="sort-by">Sort By:</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={s.sortSelect}
        >
          <option value="rank">Rank</option>
          <option value="time">Time</option>
          <option value="date">Date</option>
          <option value="score">Score</option>
        </select>
      </div>

      <div className={s.controlGroup}>
        <label htmlFor="sort-order">Order:</label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={s.orderSelect}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default TopRunsOptions;

export const rankOptions = [
  { label: "Top 1 Only", value: "1" },
  { label: "Top 1-10", value: "1-10" },
  { label: "All Ranks", value: "all" },
];

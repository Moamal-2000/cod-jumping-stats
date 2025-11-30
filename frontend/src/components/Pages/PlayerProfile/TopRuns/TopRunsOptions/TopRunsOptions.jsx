import SelectFpsButtons from "./SelectFpsButtons/SelectFpsButtons";
import s from "./TopRunsOptions.module.scss";
import TopRunsSelectMenu from "./TopRunsSelectMenu/TopRunsSelectMenu";

const TopRunsOptions = () => {
  return (
    <div className={s.topRunsControls}>
      <div className={s.fpsToggleGroup}>
        <label>Filter By FPS:</label>
        <SelectFpsButtons />
      </div>

      <TopRunsSelectMenu
        options={rankOptions}
        label="Filter By Rank:"
        urlQuery="rank"
      />

      <TopRunsSelectMenu
        options={sortOptions}
        label="Sort By:"
        urlQuery="sort"
      />

      <TopRunsSelectMenu
        options={orderOptions}
        label="Order:"
        urlQuery="order"
      />
    </div>
  );
};

export default TopRunsOptions;

const rankOptions = [
  { label: "Top 1 Only", value: "1" },
  { label: "Top 1-10", value: "1-10" },
  { label: "All Ranks", value: "all" },
];

const sortOptions = [
  { label: "Rank", value: "rank" },
  { label: "Time", value: "time" },
  { label: "Date", value: "date" },
  { label: "Nade", value: "nade" },
];

const orderOptions = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

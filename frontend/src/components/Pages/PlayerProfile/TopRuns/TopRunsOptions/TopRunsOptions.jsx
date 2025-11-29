import { JUMP_FPS } from "@/data/constants";
import { createQueryString } from "@/functions/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import s from "./TopRunsOptions.module.scss";

const TopRunsOptions = ({
  rankFilter,
  setRankFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedFps = searchParams.get("fps") || 125;

  function handleFpsClick(event) {
    const fps = +event.target.textContent;
    createQueryString("fps", fps, searchParams, router, pathname);
  }

  return (
    <div className={s.topRunsControls}>
      <div className={s.fpsToggleGroup}>
        <label>Filter By FPS:</label>

        <div className={s.fpsButtons}>
          {JUMP_FPS.map((fps) => (
            <button
              key={fps}
              className={`${s.fps} ${+selectedFps === +fps ? s.active : ""}`}
              onClick={handleFpsClick}
            >
              {fps}
            </button>
          ))}
        </div>
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

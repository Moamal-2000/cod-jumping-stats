"use client";

import s from "./ServersControls.module.scss";

const REFRESH_OPTIONS = [10, 30, 60, 120, 300];

const ServersControls = ({
  refreshSeconds,
  onRefreshSecondsChange,
  gameFilter,
  onGameFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <section className={s.controls} aria-label="Server options">
      <div className={s.controlGroup}>
        <label htmlFor="servers-refresh" className={s.groupLabel}>
          Refresh servers after
        </label>
        <div className={s.selectWrap}>
          <select
            id="servers-refresh"
            value={refreshSeconds}
            onChange={(event) =>
              onRefreshSecondsChange(Number(event.target.value))
            }
          >
            {REFRESH_OPTIONS.map((seconds) => (
              <option key={seconds} value={seconds}>
                {seconds}
              </option>
            ))}
          </select>
          <span className={s.unit}>sec</span>
        </div>
      </div>

      <div className={s.controlGroup}>
        <span className={s.groupLabel}>Show</span>
        <div className={s.toggleButtons} role="group" aria-label="Game filter">
          {[
            { id: "all", label: "Show all" },
            { id: "cod2", label: "Only COD2" },
            { id: "cod4", label: "Only COD4" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${s.toggleButton} ${
                gameFilter === option.id ? s.active : ""
              }`}
              onClick={() => onGameFilterChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={s.controlGroup}>
        <span className={s.groupLabel}>View</span>
        <div className={s.toggleButtons} role="group" aria-label="View mode">
          {[
            { id: "grid", label: "Grid" },
            { id: "list", label: "List" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${s.toggleButton} ${
                viewMode === option.id ? s.active : ""
              }`}
              onClick={() => onViewModeChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServersControls;

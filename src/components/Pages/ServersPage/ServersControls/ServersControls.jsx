"use client";

import {
  SERVER_STATUS_FILTER,
  SERVERS_GAME_FILTER_OPTIONS,
  SERVERS_REFRESH_OPTIONS,
  SERVERS_VIEW_MODE,
} from "@/data/constants";
import s from "./ServersControls.module.scss";

const ServersControls = ({
  refreshSeconds,
  onRefreshSecondsChange,
  autoRefreshEnabled,
  onAutoRefreshEnabledChange,
  gameFilter,
  onGameFilterChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <section className={s.controls} aria-label="Server options">
      <div className={s.controlGroup}>
        <label htmlFor="servers-refresh" className={s.groupLabel}>
          Refresh servers after
        </label>
        <div className={s.refreshRow}>
          <div className={s.selectWrap}>
            <select
              id="servers-refresh"
              value={refreshSeconds}
              onChange={(event) =>
                onRefreshSecondsChange(Number(event.target.value))
              }
              disabled={!autoRefreshEnabled}
            >
              {SERVERS_REFRESH_OPTIONS.map((seconds) => (
                <option key={seconds} value={seconds}>
                  {seconds}
                </option>
              ))}
            </select>
          </div>

          <label className={s.switch}>
            <input
              type="checkbox"
              checked={autoRefreshEnabled}
              onChange={(event) =>
                onAutoRefreshEnabledChange(event.target.checked)
              }
            />
            <span className={s.slider} />
            <span className={s.switchLabel}>
              {autoRefreshEnabled ? "On" : "Off"}
            </span>
          </label>
        </div>
      </div>

      <div className={s.controlGroup}>
        <span className={s.groupLabel}>Show</span>
        <div className={s.toggleButtons} role="group" aria-label="Game filter">
          {SERVERS_GAME_FILTER_OPTIONS.map((option) => (
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
        <span className={s.groupLabel}>Filters</span>
        <div
          className={s.toggleButtons}
          role="group"
          aria-label="Online filter"
        >
          {SERVER_STATUS_FILTER.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${s.toggleButton} ${
                statusFilter === option.id ? s.active : ""
              }`}
              onClick={() => onStatusFilterChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={s.controlGroup}>
        <span className={s.groupLabel}>View</span>
        <div className={s.toggleButtons} role="group" aria-label="View mode">
          {SERVERS_VIEW_MODE.map((option) => (
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

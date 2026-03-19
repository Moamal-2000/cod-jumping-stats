"use client";

import SortViewButtons from "@/components/Shared/Buttons/SortViewButtons/SortViewButtons";
import {
  SERVER_STATUS_FILTER,
  SERVERS_GAME_FILTER_OPTIONS,
  SERVERS_REFRESH_OPTIONS,
} from "@/data/constants";
import s from "./ServersControls.module.scss";

const ServersControls = ({
  refreshSeconds,
  onRefreshSecondsChange,
  autoRefreshEnabled,
  gameFilter,
  onGameFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <section className={s.controls} aria-label="Server options">
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

      <div className={s.options}>
        <div className={s.controlGroup}>
          <label htmlFor="servers-refresh" className={s.groupLabel}>
            Refresh servers
          </label>
          <div
            className={`${s.selectWrap} ${!autoRefreshEnabled ? s.inactive : ""}`}
          >
            <select
              id="servers-refresh"
              value={refreshSeconds}
              onChange={(event) => onRefreshSecondsChange(event.target.value)}
            >
              {SERVERS_REFRESH_OPTIONS.map((seconds) => (
                <option key={seconds} value={seconds}>
                  {seconds}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={s.controlGroup}>
          <span className={s.groupLabel}>View</span>
          <SortViewButtons themeColor="yellow" />
        </div>
      </div>
    </section>
  );
};

export default ServersControls;

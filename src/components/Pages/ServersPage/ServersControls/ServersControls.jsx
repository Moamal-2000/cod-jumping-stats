"use client";

import SortViewButtons from "@/components/Shared/Buttons/SortViewButtons/SortViewButtons";
import {
  DEFAULT_SERVERS_VIEW_MODE,
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
      <fieldset className={s.controlGroup}>
        <legend className={s.groupLabel}>Show</legend>

        <div className={s.toggleButtons}>
          {SERVERS_GAME_FILTER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${s.toggleButton} ${
                gameFilter === option.id ? s.active : ""
              }`}
              onClick={() => onGameFilterChange(option.id)}
              aria-pressed={gameFilter === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={s.controlGroup}>
        <legend className={s.groupLabel}>Filters</legend>

        <div className={s.toggleButtons}>
          {SERVER_STATUS_FILTER.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${s.toggleButton} ${
                statusFilter === option.id ? s.active : ""
              }`}
              onClick={() => onStatusFilterChange(option.id)}
              aria-pressed={statusFilter === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

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

        <fieldset className={s.controlGroup}>
          <legend className={s.groupLabel}>View</legend>

          <SortViewButtons
            themeColor="yellow"
            defaultView={DEFAULT_SERVERS_VIEW_MODE}
          />
        </fieldset>
      </div>
    </section>
  );
};

export default ServersControls;

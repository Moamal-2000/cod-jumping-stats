import { formatDate } from "@/functions/utils";
import s from "./TopRunsTable.module.scss";

const TopRunsTable = ({ processedRuns }) => {
  function formatTime(timeString) {
    if (!timeString) return "N/A";
    return timeString;
  }

  return (
    <div className={s.topRunsList}>
      <table className={s.leaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Map Name</th>
            <th>FPS</th>
            <th>Score</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {processedRuns.map((run, index) => {
            return (
              <tr key={`${run.run_id}-${index}`}>
                <td className={s.rankCell}>
                  <div className={`${s.rankBadge}`}>
                    <span>{run.rank}</span>
                    <span>/</span>
                    <span>{run.totalNr}</span>
                  </div>
                </td>
                <td className={s.mapNameCell} title={run.mapname}>
                  {run.mapname}
                </td>
                <td>
                  <span className={s.fpsCell}>{run.fps}</span>
                </td>
                <td>
                  <span className={s.scoreCell}>0</span>
                </td>
                <td className={s.timeCell}>
                  {formatTime(run.time_played_string)}
                </td>
                <td className={s.dateCell}>
                  {formatDate(run.time_created, "Unknown")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TopRunsTable;

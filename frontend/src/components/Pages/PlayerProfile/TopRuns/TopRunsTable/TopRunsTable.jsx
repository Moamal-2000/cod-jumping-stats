import { formatDate, getRankCategory } from "@/functions/utils";
import s from "./TopRunsTable.module.scss";

const TopRunsTable = ({ processedRuns, getScoreInfo }) => {
  function getScoreInfo(run) {
    // Always use jump-scores (defaults to 0 if not found)
    const score = run.jumpScore || 0;
    const totalNr = run.originalTotalNr || run.totalNr;
    const percentage = totalNr > 0 ? (score / totalNr) * 100 : 0;

    return {
      score,
      percentage,
      isEpic: score >= 400, // Epic threshold - starts giving credit from 400
      isLegendary: score >= 800, // Legendary threshold
      isMythical: score >= 1200, // Mythical threshold (max)
    };
  }

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
            const scoreInfo = getScoreInfo(run);
            const rowClass = scoreInfo.isMythical
              ? s.mythical
              : scoreInfo.isLegendary
              ? s.legendary
              : scoreInfo.isEpic
              ? s.epic
              : "";
            const rankCategory = getRankCategory(run.rank);
            return (
              <tr key={`${run.run_id}-${index}`} className={rowClass}>
                <td className={s.rankCell}>
                  <div className={`${s.rankBadge} ${s[rankCategory]}`}>
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
                  <span
                    className={`${s.scoreCell} ${
                      scoreInfo.isMythical
                        ? s.mythical
                        : scoreInfo.isLegendary
                        ? s.legendary
                        : scoreInfo.isEpic
                        ? s.epic
                        : ""
                    }`}
                  >
                    {scoreInfo.score.toLocaleString()}
                  </span>
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

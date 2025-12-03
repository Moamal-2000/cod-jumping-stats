import { formatDate } from "@/functions/utils";
import s from "./TopRunsTBody.module.scss";

const TopRunsTBody = ({ topRuns }) => {
  return (
    <tbody className={s.tbody}>
      {topRuns.map((run, index) => {
        return (
          <tr key={`${run.RunID}-${index}`}>
            <td className={s.rankCell}>
              <div className={`${s.rankBadge}`}>
                <span>{run.Rank}</span>
                <span>/</span>
                <span>{run.TotalNr}</span>
              </div>
            </td>

            <td className={s.mapNameCell} title={run.MapName}>
              {run.MapName}
            </td>

            <td>
              <span className={s.fpsCell}>{run.FPS}</span>
            </td>

            <td>
              <span className={s.nadesCell}>{run.Nadejumps}</span>
            </td>

            <td className={s.timeCell}>{formatTime(run.TimePlayedString)}</td>

            <td className={s.dateCell}>
              {formatDate(run.TimeCreated, "Unknown")}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default TopRunsTBody;

function formatTime(timeString) {
  if (!timeString) return "N/A";
  return timeString;
}

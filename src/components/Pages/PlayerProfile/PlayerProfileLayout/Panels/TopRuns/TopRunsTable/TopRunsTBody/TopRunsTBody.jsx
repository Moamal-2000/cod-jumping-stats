import { formatDate } from "@/lib/dateTime";
import Link from "next/link";
import s from "./TopRunsTBody.module.scss";

const TopRunsTBody = ({ topRuns }) => {
  return (
    <tbody className={s.tbody} data-type="top-runs-tbody">
      {topRuns.map((run, index) => {
        return (
          <tr key={`${run.RunID}-${index}`}>
            <td className={s.rankCell}>
              {run.Rank}/{run.TotalNr}
            </td>

            <td className={s.mapNameCell}>
              <Link href={`/map/${run.CpID}`}>{run.MapName}</Link>
            </td>

            <td className={s.fpsCell}>{run.FPS}</td>
            <td className={s.scoreCell}>{run?.Score}</td>
            <td className={s.nadesCell}>{run.Nadejumps}</td>
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

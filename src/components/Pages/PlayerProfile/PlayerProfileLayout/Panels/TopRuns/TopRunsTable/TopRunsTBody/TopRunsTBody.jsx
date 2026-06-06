import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { formatDate } from "@/lib/dateTime";
import s from "./TopRunsTBody.module.scss";

const TopRunsTBody = ({ topRuns }) => {
  return (
    <tbody className={s.tbody} data-type="top-runs-tbody">
      {topRuns.map((run, index) => {
        return (
          <tr key={`${run.RunID}-${index}`}>
            <td className={s.rankCell} data-header="Rank">
              {run.Rank}/{run.TotalNr}
            </td>

            <td className={s.mapNameCell} data-header="Map">
              <TransitionLink href={`/map/${run.CpID}`}>
                {run.MapName}
              </TransitionLink>
            </td>

            <td className={s.fpsCell} data-header="FPS">
              {run.FPS === "0" ? "Mix" : run.FPS}
            </td>
            <td className={s.scoreCell} data-header="Skill Points">
              {run?.Score}
            </td>
            <td className={s.nadesCell} data-header="Nade Jumps">
              {run.Nadejumps}
            </td>
            <td className={s.timeCell} data-header="Time">
              {formatTime(run.TimePlayedString)}
            </td>

            <td className={s.dateCell} data-header="Date">
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
  if (!timeString) {
    return "N/A";
  }
  return timeString;
}

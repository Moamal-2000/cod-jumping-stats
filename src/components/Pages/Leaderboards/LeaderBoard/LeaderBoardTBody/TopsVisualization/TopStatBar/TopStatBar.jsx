import { TOP_STATS_COLOR } from "@/data/staticData";
import s from "./TopStatBar.module.scss";

const TopStatBar = ({ top, times, maxFinishTimes, isSkilledLeaderboard }) => {
  const tooltipText = isSkilledLeaderboard
    ? `Earnt ${times} points over ${top} difficulty maps`
    : `${times} times in position #${top}`;

  const statsBarStyles = getStatsBarStyles({
    isSkilledLeaderboard,
    top,
    times,
    maxFinishTimes,
  });

  return (
    <div className={`${s.statBarWrapper} ${+top === 1 ? s.top1 : ""}`}>
      <p className={`${s.toolTip} ${+top === 0 ? s.top0 : ""}`}>
        {tooltipText}
      </p>

      <span className={s.top}>#{top}</span>
      <span className={s.times}>{times}</span>

      <div className={s.statBar} style={statsBarStyles} />
    </div>
  );
};

export default TopStatBar;

function getStatsBarStyles({
  isSkilledLeaderboard,
  top,
  times,
  maxFinishTimes,
}) {
  const backgroundColor = isSkilledLeaderboard
    ? TOP_STATS_COLOR[9 - top]
    : TOP_STATS_COLOR[top - 1];
  const height = `${(times / maxFinishTimes) * 100}%`;

  return { backgroundColor, height };
}

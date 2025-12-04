import s from "./TopRunsTable.module.scss";
import TopRunsTBody from "./TopRunsTBody/TopRunsTBody";

const TopRunsTable = ({ topRuns }) => {
  return (
    <div className={s.topRunsList}>
      <table className={s.leaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Map Name</th>
            <th>FPS</th>
            <th>Skill Points</th>
            <th>Nade Jumps</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>

        <TopRunsTBody topRuns={topRuns} />
      </table>
    </div>
  );
};

export default TopRunsTable;

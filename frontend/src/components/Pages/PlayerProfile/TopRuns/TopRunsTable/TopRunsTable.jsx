import s from "./TopRunsTable.module.scss";
import TopRunsTBody from "./TopRunsTBody/TopRunsTBody";

const TopRunsTable = ({ processedRuns }) => {
  return (
    <div className={s.topRunsList}>
      <table className={s.leaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Map Name</th>
            <th>FPS</th>
            <th>Nade Jumps</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>

        <TopRunsTBody processedRuns={processedRuns} />
      </table>
    </div>
  );
};

export default TopRunsTable;

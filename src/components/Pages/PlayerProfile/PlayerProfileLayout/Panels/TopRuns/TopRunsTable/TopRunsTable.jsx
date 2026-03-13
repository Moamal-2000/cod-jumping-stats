import s from "./TopRunsTable.module.scss";
import TopRunsTBody from "./TopRunsTBody/TopRunsTBody";

const TopRunsTable = ({ topRuns }) => {
  return (
    <div className={s.topRunsList}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th className={s.mapNameCell}>Map Name</th>
            <th className={s.fpsCell}>FPS</th>
            <th className={s.scoreCell}>Skill Points</th>
            <th>Nade Jumps</th>
            <th>Time</th>
            <th className={s.dateCell}>Date</th>
          </tr>
        </thead>

        <TopRunsTBody topRuns={topRuns} />
      </table>
    </div>
  );
};

export default TopRunsTable;

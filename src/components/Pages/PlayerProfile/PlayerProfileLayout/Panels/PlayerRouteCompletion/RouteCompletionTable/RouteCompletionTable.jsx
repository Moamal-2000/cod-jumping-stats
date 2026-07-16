import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import s from "./RouteCompletionTable.module.scss";

const RouteCompletionTable = ({
  completedRoutes,
  notCompletedRoutes,
  activeList,
}) => {
  const allPlayersData = useSelector((s) => s.players.allPlayersData);
  const allPlayersLength = allPlayersData.length || 0;

  const activeListData =
    activeList === "completed" ? completedRoutes : notCompletedRoutes;

  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source") || "jh";

  function renderMapRow(map, index, IsCompleted) {
    const rarityLevel = getRarityLevel(map.IndividualFinishCount);

    return (
      <tr
        key={`${map.MapID}-${map.MapName}-${index}`}
        className={`${s.tableRow} ${s[rarityLevel] || ""}`}
      >
        <td className={s.mapNameCell}>
          <Link
            href={`/map/${map.CpID}${sourceParam === "jh" ? "" : `?source=${sourceParam}`}`}
            className={s.mapLink}
          >
            {map.DisplayName}
          </Link>
        </td>
        <td className={s.authorCell}>{map.Author || "Unknown"}</td>
        <td className={s.releasedCell}>{map.Released || "Unknown"}</td>
        <td className={s.finisherCell}>
          <span className={s.finisherBadge}>
            {map.IndividualFinishCount} / {allPlayersLength}
          </span>
        </td>
        <td className={s.statusCell}>
          {IsCompleted ? (
            <span className={s.completedBadge}>
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#check-circle" />
              </svg>
              Completed
            </span>
          ) : (
            <span className={s.notCompletedBadge}>
              <svg aria-hidden="true">
                <use href="/icons-sprite.svg#x-circle" />
              </svg>
              Not Completed
            </span>
          )}
        </td>
      </tr>
    );
  }

  return (
    <table className={s.completionTable}>
      <thead>
        <tr>
          <th>Map Name</th>
          <th>Author</th>
          <th>Released</th>
          <th>Finishers</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {activeListData.map((map, index) =>
          renderMapRow(map, index, activeList === "completed"),
        )}
      </tbody>
    </table>
  );
};
export default RouteCompletionTable;

function getRarityLevel(finishCount) {
  if (finishCount <= 2) {
    return "mythical";
  }
  if (finishCount <= 10) {
    return "legendary";
  }
  if (finishCount <= 20) {
    return "epic";
  }
  if (finishCount <= 30) {
    return "rare";
  }
  if (finishCount <= 50) {
    return "uncommon";
  }
  return "common";
}

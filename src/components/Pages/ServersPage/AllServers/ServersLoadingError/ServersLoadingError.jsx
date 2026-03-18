import {
  COD2_SERVERS_COUNT,
  COD4_SERVERS_COUNT,
  DEFAULT_VIEW_MODE,
  SERVERS_LIST_COUNT,
} from "@/data/constants";
import { useSearchParams } from "next/navigation";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import s from "./ServersLoadingError.module.scss";

const ServersLoadingError = ({ loading, error, gameParam }) => {
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || DEFAULT_VIEW_MODE;

  const skeletonList = getSkeletonList(gameParam, viewType);

  if (loading && viewType === "list") {
    return (
      <section className={s.listWrapper} role="presentation">
        <div className={s.listTitle}>
          <div className={`${s.skeletonLine} ${s.titleLine}`} />
        </div>
        <div className={s.tableWrap}>
          <table className={s.serversTable}>
            <thead>
              <tr>
                <th>Country</th>
                <th>Map</th>
                <th>Player</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {skeletonList.map((_, i) => (
                <tr key={i}>
                  <td className={s.serverCell}>
                    <div className={`${s.skeletonLine} ${s.flagLine}`} />
                  </td>
                  <td className={s.mapCell}>
                    <div className={`${s.skeletonLine} ${s.mapLine}`} />
                  </td>
                  <td className={s.playerCell}>
                    <div className={`${s.skeletonLine} ${s.playerLine}`} />
                  </td>
                  <td className={s.addressCell}>
                    <div className={`${s.skeletonLine} ${s.addressLine}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (loading && viewType === DEFAULT_VIEW_MODE) {
    return (
      <section className={s.serversGrid} role="presentation">
        {skeletonList.map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className={s.errorContainer}>
        <h3>Server Status Unavailable</h3>
        <p>{error}</p>
      </div>
    );
  }
};

export default ServersLoadingError;

function getSkeletonList(gameParam, viewType) {
  let serversCount = 0;

  if (viewType === DEFAULT_VIEW_MODE) {
    if (gameParam === "cod2" || gameParam === "all") {
      serversCount = COD2_SERVERS_COUNT;
    }

    if (gameParam === "cod4") {
      serversCount = COD4_SERVERS_COUNT;
    }
  }

  if (viewType === "list") {
    serversCount = SERVERS_LIST_COUNT;
  }

  return Array.from({ length: serversCount }, (_, i) => i);
}

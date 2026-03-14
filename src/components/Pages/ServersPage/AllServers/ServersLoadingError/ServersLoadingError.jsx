import { COD2_SERVERS_COUNT, COD4_SERVERS_COUNT } from "@/data/constants";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import s from "./ServersLoadingError.module.scss";

const ServersLoadingError = ({ loading, error, viewMode, gameParam }) => {
  const skeletonList = getSkeletonList(gameParam);

  if (loading && viewMode === "list") {
    return (
      <section className={s.listWrapper}>
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
              {[...Array(12)].map((_, i) => (
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

  if (loading && viewMode === "grid") {
    return (
      <div className={s.serversGrid}>
        {skeletonList.map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
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

function getSkeletonList(gameParam) {
  let serversCount = 0;

  if (gameParam === "cod2" || gameParam === "all") {
    serversCount = COD2_SERVERS_COUNT;
  }

  if (gameParam === "cod4") {
    serversCount = COD4_SERVERS_COUNT;
  }

  return Array.from({ length: serversCount }, (_, i) => i);
}

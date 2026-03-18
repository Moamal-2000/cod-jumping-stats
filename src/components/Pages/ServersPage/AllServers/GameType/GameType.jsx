import { DEFAULT_VIEW_MODE } from "@/data/constants";
import { useSearchParams } from "next/navigation";
import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";
import ServersList from "./ServersList/ServersList";

const GameType = ({ gameType, groupedServers }) => {
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || DEFAULT_VIEW_MODE;

  if (viewType === "list") {
    return <ServersList groupedServers={groupedServers} gameType={gameType} />;
  }

  return (
    <div className={s.serversGrid} key={gameType}>
      {groupedServers[gameType].map((server, index) => (
        <ServerCard
          key={`${server.Domain}${server.IP}${server.Port}`}
          server={server}
          index={index}
          viewType={viewType}
        />
      ))}
    </div>
  );
};

export default GameType;

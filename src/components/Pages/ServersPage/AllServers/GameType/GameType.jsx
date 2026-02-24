import CopyButton from "@/components/Shared/Buttons/CopyButton/CopyButton";
import { getColoredName } from "@/functions/components";
import { getCountryFlag } from "@/functions/utils";
import Image from "next/image";
import Link from "next/link";
import s from "./GameType.module.scss";
import ServerCard from "./ServerCard/ServerCard";

const GameType = ({ gameType, groupedServers, viewMode }) => {
  if (viewMode === "list") {
    return (
      <section className={s.listWrapper} key={gameType}>
        <div className={s.listTitle}>{gameType}</div>
        <div className={s.tableWrap}>
          <table className={s.serversTable}>
            <thead>
              <tr>
                <th>Server</th>
                <th>Map</th>
                <th>Player</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {groupedServers[gameType].map((server) => {
                const isCod4 = server.GameType === "COD4";
                const address = `${server.IP}:${server.Port}`;
                const players = server?.Players || [];
                const rows =
                  server.Online && players.length > 0 ? players : [null];

                return rows.map((player, index) => {
                  const playerName = player
                    ? getColoredName(
                        player?.PrefName || player?.Name || "Unknown",
                      )
                    : server.Online
                      ? ""
                      : "Offline";

                  return (
                    <tr
                      key={`${server.Domain}${server.IP}${server.Port}-${index}`}
                    >
                      <td className={s.serverCell}>
                        <Image
                          src={getCountryFlag(server.Domain)}
                          alt="Country flag"
                          width="26"
                          height="20"
                        />
                      </td>
                      <td className={s.mapCell}>
                        {isCod4 ? (
                          <span>{server.Map}</span>
                        ) : (
                          <Link href={`/map/${server.MapID}`}>
                            {server.Map}
                          </Link>
                        )}
                      </td>
                      <td className={s.playerCell}>
                        <Link href={`/player/${player?.PlayerID || -1}`}>
                          {playerName}
                        </Link>
                      </td>
                      <td className={s.addressCell}>
                        <span>{address}</span>
                        <CopyButton
                          title="Copy server address"
                          textToCopy={address}
                        />
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <div className={s.serversGrid} key={gameType}>
      {groupedServers[gameType].map((server, index) => (
        <ServerCard
          key={`${server.Domain}${server.IP}${server.Port}`}
          server={server}
          index={index}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default GameType;

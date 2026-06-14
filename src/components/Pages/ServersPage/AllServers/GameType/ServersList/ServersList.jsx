"use client";

import { getColoredName } from "@/components/Helper/playerNameColor";
import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import { copyText, domainToCountryFlag } from "@/lib/utils";
import Image from "next/image";
import { useDispatch } from "react-redux";
import s from "./ServersList.module.scss";

const ServersList = ({ groupedServers, gameType }) => {
  const dispatch = useDispatch();

  return (
    <section className={s.listWrapper} key={gameType}>
      <div className={`${s.listTitle} ${s[gameType]}`}>{gameType}</div>
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
                  <tr key={`${server.IP}${server.Port}-${index}`}>
                    <td className={s.serverCell} data-label="Server">
                      <Image
                        src={domainToCountryFlag(server.Domain)}
                        alt="Country flag"
                        width="26"
                        height="20"
                      />
                    </td>
                    <td className={s.mapCell} data-label="Map">
                      {isCod4 && server.Online ? (
                        <span>{server.Map}</span>
                      ) : (
                        server.Online && (
                          <TransitionLink href={`/map/${server.MapID}`}>
                            {server.Map}
                          </TransitionLink>
                        )
                      )}
                    </td>
                    <td className={s.playerCell} data-label="Player">
                      {player?.PlayerID ? (
                        <TransitionLink href={`/player/${player.PlayerID}`}>
                          {playerName}
                        </TransitionLink>
                      ) : (
                        <span>{playerName}</span>
                      )}
                    </td>
                    <td className={s.addressCell} data-label="Address">
                      <div className={s.addressValue}>
                        <button
                          type="button"
                          className={s.serverAddressBtn}
                          onClick={() =>
                            copyText({ textToCopy: address, dispatch })
                          }
                        >
                          {address}
                        </button>
                      </div>
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
};
export default ServersList;

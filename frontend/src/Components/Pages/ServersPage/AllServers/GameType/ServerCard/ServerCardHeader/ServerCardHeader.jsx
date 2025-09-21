"use client";

import SvgIcon from "@/Components/Shared/SvgIcon";
import { getCountryFlag, getServerStatusColor } from "@/Functions/utils";
import Image from "next/image";
import { useState } from "react";
import s from "./ServerCardHeader.module.scss";

const ServerCardHeader = ({ server }) => {
  const [src, setSrc] = useState(`/maps/512/${server.map}.webp`);

  return (
    <header className={s.serverHeader}>
      <div className={s.countryFlag}>
        <Image
          src={getCountryFlag(server.domain)}
          alt="Country flag"
          width="30"
          height="26"
          className={s.flag}
        />
      </div>

      <div className={s.serverAddress}>
        <div className={s.domainInfo}>
          <span className={s.domain}>{server.domain}</span>
        </div>

        <div className={s.serverIpContainer}>
          <p className={s.serverIp}>
            {server.ip}:{server.port}
          </p>
          <button
            className={s.copyButton}
            onClick={() => {
              navigator.clipboard.writeText(`${server.ip}:${server.port}`);
            }}
            title="Copy server address"
          >
            <SvgIcon name="copy" />
          </button>
        </div>
      </div>

      <div className={s.serverStatusIndicator}>
        <span
          className={s.statusDot}
          style={{
            backgroundColor: getServerStatusColor(server.online),
          }}
        />
        <span className={s.statusText}>
          <SvgIcon name="users" />
          {server.online ? `${server.player_count || 0} Players` : "Offline"}
        </span>
      </div>

      <Image
        src={src}
        alt={server.map}
        fill={true}
        sizes="383px"
        className={s.mapBackground}
        onError={() => setSrc("/placeholders/blank-black.svg")}
      />
    </header>
  );
};

export default ServerCardHeader;

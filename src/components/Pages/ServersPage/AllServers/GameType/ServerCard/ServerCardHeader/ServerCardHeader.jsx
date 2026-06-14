"use client";

import { domainToCountryFlag } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import JoinServerButton from "./JoinServerButton/JoinServerButton";
import s from "./ServerCardHeader.module.scss";
import ServerCardIndicator from "./ServerCardIndicator/ServerCardIndicator";
import ServerCardIp from "./ServerCardIp/ServerCardIp";

const PLACEHOLDER_URL = "/assets/placeholders/blank-black.svg";
const GAME_MAPS_URL = {
  cod2: (server) => `/assets/maps/512/${server.Map}.webp`,
  cod4: () => PLACEHOLDER_URL,
};

const ServerCardHeader = ({ server, index, viewType }) => {
  const game = server.GameType.toLowerCase();
  const getGameMapUrl = GAME_MAPS_URL[game] || (() => PLACEHOLDER_URL);

  const [src, setSrc] = useState(getGameMapUrl(server));

  const isList = viewType === "list";

  return (
    <header className={`${s.serverHeader} ${isList ? s.list : ""}`}>
      <div className={s.countryFlag}>
        <Image
          src={domainToCountryFlag(server.Domain)}
          alt="Country flag"
          width="30"
          height="26"
          className={s.flag}
        />
      </div>

      <ServerCardIp server={server} />

      <div className={s.wrapper}>
        <ServerCardIndicator server={server} />
        <JoinServerButton server={server} />
      </div>

      {!isList && (
        <Image
          src={src}
          alt={server.Map}
          fill={true}
          sizes="383px"
          className={s.mapBackground}
          onError={() => setSrc(PLACEHOLDER_URL)}
          loading={index < 3 ? "eager" : "lazy"}
          preload={index < 3}
          fetchPriority={index < 3 ? "high" : "low"}
        />
      )}
    </header>
  );
};

export default ServerCardHeader;

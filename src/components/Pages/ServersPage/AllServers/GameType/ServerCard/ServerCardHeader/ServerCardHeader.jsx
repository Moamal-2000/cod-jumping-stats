"use client";

import { domainToCountryFlag } from "@/lib/utils";
import { isMobile } from "@/lib/validation";
import Image from "next/image";
import { useState } from "react";
import s from "./ServerCardHeader.module.scss";
import ServerCardIndicator from "./ServerCardIndicator/ServerCardIndicator";
import ServerCardIp from "./ServerCardIp/ServerCardIp";

const ServerCardHeader = ({ server, index, viewType }) => {
  const [src, setSrc] = useState(`/assets/maps/512/${server.Map}.webp`);

  const isList = viewType === "list";
  const ShowJoinServerLink = server.GameType === "COD2" && !isMobile();

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
        {ShowJoinServerLink && (
          <a
            href={`cod2x://%2Bconnect%20${server.IP}%3A${server.Port}`}
            title={`Connect via cod2x:// to ${server.IP}:${server.Port}`}
            className={s.joinServerLink}
          >
            Join Server
          </a>
        )}
      </div>

      {!isList && (
        <Image
          src={src}
          alt={server.Map}
          fill={true}
          sizes="383px"
          className={s.mapBackground}
          onError={() => setSrc("/assets/placeholders/blank-black.svg")}
          loading={index < 3 ? "eager" : "lazy"}
          preload={index < 3}
          fetchPriority={index < 3 ? "high" : "low"}
        />
      )}
    </header>
  );
};

export default ServerCardHeader;

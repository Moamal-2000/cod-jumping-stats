"use client";

import { getCountryFlag } from "@/Functions/utils";
import Image from "next/image";
import { useState } from "react";
import s from "./ServerCardHeader.module.scss";
import ServerCardIndicator from "./ServerCardIndicator/ServerCardIndicator";
import ServerCardIp from "./ServerCardIp/ServerCardIp";

const ServerCardHeader = ({ server, index }) => {
  const [src, setSrc] = useState(`/maps/512/${server.Map}.webp`);

  return (
    <header className={s.serverHeader}>
      <div className={s.countryFlag}>
        <Image
          src={getCountryFlag(server.Domain)}
          alt="Country flag"
          width="30"
          height="26"
          className={s.flag}
        />
      </div>

      <ServerCardIp server={server} />
      <ServerCardIndicator server={server} />

      <Image
        src={src}
        alt={server.Map}
        fill={true}
        sizes="383px"
        className={s.mapBackground}
        onError={() => setSrc("/placeholders/blank-black.svg")}
        loading={index < 3 ? "eager" : "lazy"}
        priority={index < 3}
        fetchPriority={index < 3 ? "high" : "low"}
      />
    </header>
  );
};

export default ServerCardHeader;

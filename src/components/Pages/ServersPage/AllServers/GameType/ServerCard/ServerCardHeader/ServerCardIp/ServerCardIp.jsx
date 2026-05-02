"use client";

import { copyText } from "@/lib/utils";
import { useDispatch } from "react-redux";
import s from "./ServerCardIp.module.scss";

const ServerCardIp = ({ server }) => {
  const dispatch = useDispatch();

  const serverAddress = `${server.IP}:${server.Port}`;

  return (
    <div className={s.serverAddress}>
      <div className={s.domainInfo}>
        <button
          type="button"
          className={s.domainBtn}
          onClick={() => copyText({ textToCopy: server.Domain, dispatch })}
        >
          {server.Domain}
        </button>
      </div>

      <div className={s.serverIpContainer}>
        <button
          type="button"
          className={s.serverAddressBtn}
          onClick={() => copyText({ textToCopy: serverAddress, dispatch })}
        >
          {serverAddress}
        </button>
      </div>
    </div>
  );
};

export default ServerCardIp;

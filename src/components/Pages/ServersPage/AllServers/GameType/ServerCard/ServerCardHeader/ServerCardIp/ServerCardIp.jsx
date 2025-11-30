import CopyButton from "@/components/Shared/Buttons/CopyButton/CopyButton";
import s from "./ServerCardIp.module.scss";

const ServerCardIp = ({ server }) => {
  return (
    <div className={s.serverAddress}>
      <div className={s.domainInfo}>
        <span className={s.domain}>{server.Domain}</span>
      </div>

      <div className={s.serverIpContainer}>
        <p className={s.serverIp}>
          {server.IP}:{server.Port}
        </p>
        <CopyButton
          title="Copy server address"
          copyText={`${server.IP}:${server.Port}`}
        />
      </div>
    </div>
  );
};

export default ServerCardIp;

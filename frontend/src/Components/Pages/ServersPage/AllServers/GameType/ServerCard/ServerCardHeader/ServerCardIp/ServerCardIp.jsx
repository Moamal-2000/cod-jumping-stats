import CopyButton from "@/Components/Shared/Buttons/CopyButton/CopyButton";
import s from "./ServerCardIp.module.scss";

const ServerCardIp = ({ server }) => {
  return (
    <div className={s.serverAddress}>
      <div className={s.domainInfo}>
        <span className={s.domain}>{server.domain}</span>
      </div>

      <div className={s.serverIpContainer}>
        <p className={s.serverIp}>
          {server.ip}:{server.port}
        </p>
        <CopyButton
          title="Copy server address"
          copyText={`${server.ip}:${server.port}`}
        />
      </div>
    </div>
  );
};

export default ServerCardIp;

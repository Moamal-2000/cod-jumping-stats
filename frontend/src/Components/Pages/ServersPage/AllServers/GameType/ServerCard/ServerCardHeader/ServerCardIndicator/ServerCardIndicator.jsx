import SvgIcon from "@/Components/Shared/SvgIcon";
import { getServerStatusColor } from "@/Functions/utils";
import s from "./ServerCardIndicator.module.scss";

const ServerCardIndicator = ({ server }) => {
  return (
    <div className={s.indicator}>
      <span
        className={s.statusDot}
        style={{
          backgroundColor: getServerStatusColor(server.Online),
        }}
      />
      <span className={s.statusText}>
        <SvgIcon name="users" />
        {server.Online ? `${server.PlayerCount || 0} Players` : "Offline"}
      </span>
    </div>
  );
};

export default ServerCardIndicator;

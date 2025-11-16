import s from "./ServerCardIndicator.module.scss";

const ServerCardIndicator = ({ server }) => {
  return (
    <div className={s.indicator}>
      <span
        className={`${s.statusDot} ${server.Online ? s.online : s.offline}`}
      />

      <span className={s.statusText}>
        {server.Online ? `${server.PlayerCount || 0} Players` : "Offline"}
      </span>
    </div>
  );
};

export default ServerCardIndicator;

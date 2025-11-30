import s from "./ServerCardIndicator.module.scss";

const ServerCardIndicator = ({ server }) => {
  const statusDotClasses = `${s.statusDot} ${
    server.Online ? s.online : s.offline
  }`;

  const statusText = server.Online
    ? `${server.PlayerCount || 0} Players`
    : "Offline";

  return (
    <div className={s.indicator}>
      <span className={statusDotClasses} />
      <span>{statusText}</span>
    </div>
  );
};

export default ServerCardIndicator;

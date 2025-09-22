import s from "./PlayerStats.module.scss";

const PlayerStats = ({ visitCount, lastSeen }) => {
  return (
    <div className={s.statsGrid}>
      <div className={s.statItem}>
        <span className={s.statLabel}>Visits:</span>
        <span className={s.statValue}>{visitCount.toLocaleString()}</span>
      </div>

      <div className={s.statItem}>
        <span className={s.statLabel}>Last seen:</span>
        <span className={s.statValue}>{formatLastSeen(lastSeen)}</span>
      </div>
    </div>
  );
};

export default PlayerStats;

function formatLastSeen(lastSeen) {
  if (!lastSeen) return "Unknown";

  const date = new Date(lastSeen);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

  return date.toLocaleDateString();
}

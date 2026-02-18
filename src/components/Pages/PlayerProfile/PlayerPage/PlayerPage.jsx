import Link from "next/link";
import s from "./PlayerPage.module.scss";

const PlayerPage = () => {
  return (
    <div className="container">
      <main>
        <section className={s.heroSection}>
          <h1>Players Overview</h1>

          <p className={s.description}>
            Explore all Jumpers Heaven <Link href="/players">players</Link>.
            Click on a player to view detailed statistics, performance history,
            and records.
          </p>

          <div className={s.buttons}>
            <Link href="/players" className={s.primaryAction}>
              Browse Players
            </Link>
            <Link href="/leaderboards" className={s.secondaryAction}>
              View Leaderboards
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PlayerPage;

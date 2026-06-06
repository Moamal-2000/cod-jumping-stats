import TransitionLink from "@/components/Shared/Links/TransitionLink/TransitionLink";
import s from "./PlayerPageFallback.module.scss";

const PlayerPageFallback = () => {
  return (
    <div className="container">
      <main>
        <section className={s.heroSection}>
          <h1>Jumpers Heaven Players</h1>

          <p className={s.description}>
            Explore all Jumpers Heaven{" "}
            <TransitionLink href="/players">players</TransitionLink>. Click on a
            player to view detailed statistics, performance history, and
            records.
          </p>

          <div className={s.buttons}>
            <TransitionLink href="/players" className={s.primaryAction}>
              Browse Players
            </TransitionLink>
            <TransitionLink href="/leaderboards" className={s.secondaryAction}>
              View Leaderboards
            </TransitionLink>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PlayerPageFallback;

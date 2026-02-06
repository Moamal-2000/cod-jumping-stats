import PlayerCard from "../PlayerCard/PlayerCard";
import s from "./PlayersCardsSection.module.scss";

const PlayersCardsSection = ({
  playersScroll,
  allDataDisplayed,
  lastPlayerRef,
  searchByName,
}) => {
  return (
    <section className={s.playersSection}>
      {playersScroll.map((player, index) => {
        const ref = playersScroll.length === index + 1 ? lastPlayerRef : null;
        return <PlayerCard key={player.PlayerID} cardRef={ref} {...player} />;
      })}

      {allDataDisplayed && playersScroll.length > 0 && !searchByName && (
        <div className={s.endOfResults}>
          <p>You've reached the end of the players list.</p>
        </div>
      )}
    </section>
  );
};

export default PlayersCardsSection;

import PlayerCard from "../PlayerCard/PlayerCard";
import s from "./PlayersSection.module.scss";
import PlayersTable from "./PlayersTable/PlayersTable";

const viewType = "grid";

const PlayersSection = ({
  playersScroll,
  allDataDisplayed,
  lastPlayerRef,
  searchByName,
}) => {
  return (
    <section className={s.playersSection}>
      {viewType === "grid" &&
        playersScroll.map((player, index) => {
          const ref = playersScroll.length === index + 1 ? lastPlayerRef : null;
          return <PlayerCard key={player.PlayerID} cardRef={ref} {...player} />;
        })}

      {viewType === "list" && (
        <PlayersTable
          playersScroll={playersScroll}
          lastPlayerRef={lastPlayerRef}
        />
      )}

      {allDataDisplayed && playersScroll.length > 0 && !searchByName && (
        <div className={s.endOfResults}>
          <p>You've reached the end of the players list.</p>
        </div>
      )}
    </section>
  );
};

export default PlayersSection;

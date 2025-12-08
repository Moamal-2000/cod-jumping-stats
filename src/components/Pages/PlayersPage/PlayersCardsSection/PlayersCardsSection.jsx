import PlayerCard from "../PlayerCard/PlayerCard";
import s from "./PlayersCardsSection.module.scss";

const PlayersCardsSection = ({
  playersToDisplay,
  hasMore,
  isLoadingMore,
  loadMoreRef,
  searchByName,
}) => {
  return (
    <section className={s.playersSection}>
      {playersToDisplay.map((player) => (
        <PlayerCard key={player.PlayerID} {...player} />
      ))}

      {isLoadingMore && (
        <div className={s.loadingMoreContainer}>
          <div className={s.loadingSpinner}></div>
          <p>Loading more players...</p>
        </div>
      )}

      {hasMore && !isLoadingMore && !searchByName && (
        <div ref={loadMoreRef} className={s.loadMoreTrigger} />
      )}

      {!hasMore && playersToDisplay.length > 0 && !searchByName && (
        <div className={s.endOfResults}>
          <p>You've reached the end of the players list!</p>
        </div>
      )}
    </section>
  );
};

export default PlayersCardsSection;

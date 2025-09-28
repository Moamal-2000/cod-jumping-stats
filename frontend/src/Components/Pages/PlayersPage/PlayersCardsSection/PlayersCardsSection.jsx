import PlayerCard from "../PlayerCard/PlayerCard";
import s from "./PlayersCardsSection.module.scss";

const PlayersCardsSection = ({
  playersToDisplay,
  hasMore,
  isLoadingMore,
  loadMoreRef,
  searchTerm,
}) => {
  return (
    <section className={s.playersSection}>
      {playersToDisplay.map((playerData, index) => (
        <PlayerCard key={playerData.id} rank={index + 1} {...playerData} />
      ))}

      {isLoadingMore && (
        <div className={s.loadingMoreContainer}>
          <div className={s.loadingSpinner}></div>
          <p>Loading more players...</p>
        </div>
      )}

      {hasMore && !isLoadingMore && !searchTerm && (
        <div ref={loadMoreRef} className={s.loadMoreTrigger} />
      )}

      {!hasMore && playersToDisplay.length > 0 && !searchTerm && (
        <div className={s.endOfResults}>
          <p>You've reached the end of the players list!</p>
        </div>
      )}
    </section>
  );
};

export default PlayersCardsSection;

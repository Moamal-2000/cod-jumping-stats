import PlayerCard from "@/components/Pages/PlayersPage/PlayerCard/PlayerCard";
import SpinnerLoader from "@/components/Shared/Loaders/SpinnerLoader/SpinnerLoader";
import EmptyState from "../../EmptyState/EmptyState";
import s from "./FavPlayers.module.scss";

const FavPlayers = ({ favPlayers, playersLoading }) => {
  if (playersLoading && favPlayers.length === 0)
    return (
      <SpinnerLoader
        title="Loading Players"
        description="Fetching your favorite players..."
      />
    );

  if (!playersLoading && favPlayers.length === 0)
    return <EmptyState type="players" />;

  return (
    <div className={s.players}>
      {favPlayers.map((player) => (
        <PlayerCard key={player.PlayerID} {...player} />
      ))}
    </div>
  );
};

export default FavPlayers;

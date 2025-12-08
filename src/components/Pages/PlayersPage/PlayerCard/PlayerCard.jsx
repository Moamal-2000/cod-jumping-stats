import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import { checkIsItemFavorited, toggleFavorite } from "@/functions/components";
import { useEffect, useState } from "react";
import PlayerBadges from "./PlayerBadges/PlayerBadges";
import s from "./PlayerCard.module.scss";
import PlayerPrimaryInfo from "./PlayerPrimaryInfo/PlayerPrimaryInfo";
import PlayerStats from "./PlayerStats/PlayerStats";

const PlayerCard = ({
  PlayerName,
  PrefName,
  PlayerID,
  Admin,
  LastSeen,
  Visits,
  Country,
  Banned,
  Donated,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    checkIsItemFavorited({ setIsFavorited, id: PlayerID });
  }, [PlayerID]);

  return (
    <div className={s.playerCard}>
      <div className={s.topSection}>
        <header className={s.header}>
          <div className={s.wrapper}>
            <div className={s.country}>
              <CountryImage
                countryCode={Country}
                size={40}
                colorPlaceholder={true}
              />
            </div>

            <PlayerPrimaryInfo
              PlayerName={PrefName || PlayerName}
              Admin={Admin}
              PlayerID={PlayerID}
            />
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite({ setIsFavorited, id: PlayerID })}
            className={`${s.favoriteButton} ${isFavorited ? s.favorited : ""}`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <svg viewBox="0 0 24 24">
              <use
                href={`/icons-sprite.svg#${isFavorited ? "trashCan" : "heart"}`}
              ></use>
            </svg>
          </button>
        </header>

        <PlayerBadges
          Admin={Admin}
          Banned={Banned}
          Donated={Donated}
          PlayerID={PlayerID}
          LastSeen={LastSeen}
        />
      </div>

      <PlayerStats LastSeen={LastSeen} Visits={Visits} />
    </div>
  );
};

export default PlayerCard;

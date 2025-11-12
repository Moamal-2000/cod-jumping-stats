import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
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
  return (
    <div className={s.playerCard}>
      <div className={s.topSection}>
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

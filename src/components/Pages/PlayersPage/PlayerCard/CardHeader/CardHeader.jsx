import AddToFavButton from "@/components/Shared/Buttons/AddToFavButton/AddToFavButton";
import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import s from "./CardHeader.module.scss";
import PlayerPrimaryInfo from "./PlayerPrimaryInfo/PlayerPrimaryInfo";

const CardHeader = ({ PlayerName, PrefName, PlayerID, Country, Admin }) => {
  return (
    <header className={s.cardHeader}>
      <div className={s.wrapper}>
        <div className={s.country}>
          <CountryImage
            countryCode={Country}
            size={40}
            colorPlaceholder={true}
          />
        </div>

        <PlayerPrimaryInfo
          PlayerName={PlayerName || PrefName}
          PrefName={PrefName}
          Admin={Admin}
          PlayerID={PlayerID}
        />
      </div>

      <AddToFavButton
        groupKey="playersIds"
        id={PlayerID}
        className={s.favButton}
      />
    </header>
  );
};

export default CardHeader;

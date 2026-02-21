import CountryImage from "@/components/Shared/Images/CountryImage/CountryImage";
import { getColoredName } from "@/functions/components";
import Link from "next/link";
import PlayerBadges from "../PlayerCard/PlayerBadges/PlayerBadges";
import { formatLastSeen } from "../PlayerCard/PlayerStats/PlayerStats";
import s from "./PlayersCardsSection.module.scss";

const PlayersCardsSection = ({
  playersScroll,
  allDataDisplayed,
  lastPlayerRef,
  searchByName,
}) => {
  // return (
  //   <section className={s.playersSection}>
  //     {playersScroll.map((player, index) => {
  //       const ref = playersScroll.length === index + 1 ? lastPlayerRef : null;
  //       return <PlayerCard key={player.PlayerID} cardRef={ref} {...player} />;
  //     })}

  //     {allDataDisplayed && playersScroll.length > 0 && !searchByName && (
  //       <div className={s.endOfResults}>
  //         <p>You've reached the end of the players list.</p>
  //       </div>
  //     )}
  //   </section>
  // );

    return (
    <section className={s.playersSection}>
      <table className={s.playersTable}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Visits</th>
            <th>Last Seen</th>
            <th>Badges</th>
          </tr>
        </thead>

        <tbody>
          {playersScroll.map((player, index) => {
            const ref =
              playersScroll.length === index + 1 ? lastPlayerRef : null;

            return (
              <tr key={player.PlayerID} ref={ref}>
                <td className={s.playerNameCell}>
                  <div className={s.playerInfoWrapper}>
                    <div className={s.countryFlag}>
                      <CountryImage
                        countryCode={player.Country}
                        size={32}
                        colorPlaceholder={true}
                      />
                    </div>
                    <Link
                      href={`/player/${player.PlayerID}`}
                      className={s.playerLink}
                    >
                      <div className={s.playerNameWrapper}>
                        <span className={s.playerName}>
                          {getColoredName(player.PlayerName || player.PrefName)}
                        </span>
                        {player.PrefName && (
                          <span className={s.originalName}>
                            {getColoredName(player.PrefName)}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                </td>
                <td className={s.visitsCell}>
                  <span className={s.visitsValue}>{player.Visits || 0}</span>
                </td>
                <td className={s.lastSeenCell}>
                  {formatLastSeen(player.LastSeen) || "Never"}
                </td>
                <td className={s.badgesCell}>
                  <PlayerBadges
                    Admin={player.Admin}
                    Banned={player.Banned}
                    Donated={player.Donated}
                    PlayerID={player.PlayerID}
                    LastSeen={player.LastSeen}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {allDataDisplayed && playersScroll.length > 0 && !searchByName && (
        <div className={s.endOfResults}>
          <p>You've reached the end of the players list.</p>
        </div>
      )}
    </section>
  );
};

export default PlayersCardsSection;

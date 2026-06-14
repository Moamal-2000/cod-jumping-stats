import { updatePlayerProfileState } from "@/redux/features/playerProfile/slice/playerProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import s from "./PlayerProfileButton.module.scss";

const PlayerProfileButton = () => {
  const playerProfileId = useSelector((s) => s.playerProfile.playerProfileId);

  const dispatch = useDispatch();

  function handleStorePlayer() {
    const playerProfileIdLocal = localStorage.getItem("player-profile-id");

    if (playerProfileIdLocal) {
      localStorage.removeItem("player-profile-id");
      dispatch(
        updatePlayerProfileState({ key: "playerProfileId", value: null }),
      );
      return;
    }

    localStorage.setItem("player-profile-id", playerId);
    dispatch(
      updatePlayerProfileState({ key: "playerProfileId", value: playerId }),
    );
  }

  return (
    <button
      type="button"
      onClick={handleStorePlayer}
      className={s.myProfileButton}
    >
      <svg aria-hidden="true">
        <use
          href={`/icons-sprite.svg#${playerProfileId ? "trash-can" : "pin"}`}
        />
      </svg>
    </button>
  );
};
export default PlayerProfileButton;

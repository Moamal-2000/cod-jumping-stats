import { openVideo } from "@/functions/utils";
import s from "./MapsVideos.module.scss";

const MapsVideos = ({ videos }) => {
  return (
    <div className={s.videos}>
      {!videos?.length && <p>This map has no videos.</p>}

      {videos?.map(({ type, icon, id }, index) => (
        <button
          type="button"
          className={s.video}
          key={id}
          onClick={() => openVideo(videos, index)}
          data-icon={icon}
        >
          <svg aria-hidden="true">
            <use href={`icons-sprite.svg#${icon}`} />
          </svg>
          <span className={s.type}>{type}</span>
        </button>
      ))}
    </div>
  );
};

export default MapsVideos;

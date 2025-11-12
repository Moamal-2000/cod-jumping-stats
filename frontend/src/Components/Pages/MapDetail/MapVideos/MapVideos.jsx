import { MAPS_VIDEOS } from "@/data/mapsVideos";
import s from "./MapVideos.module.scss";
import Video from "./Video/Video";

const MapVideos = ({ mapId }) => {
  const videos = MAPS_VIDEOS.find((map) => map.mapId === mapId)?.videos || [];

  if (videos.length === 0)
    return <div className={s.noVideos}>No videos available for this map</div>;

  return (
    <div className={s.videosList}>
      {videos.map((video, index) => (
        <Video key={`${video.id}-${index}`} video={video} />
      ))}
    </div>
  );
};

export default MapVideos;

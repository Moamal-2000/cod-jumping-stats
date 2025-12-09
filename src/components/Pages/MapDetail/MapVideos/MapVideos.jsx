import { MAPS_VIDEOS } from "@/data/mapsVideos";
import s from "./MapVideos.module.scss";
import Video from "./Video/Video";

const MapVideos = ({ mapData }) => {
  const videos = getMapVideos(mapData);

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

function getMapVideos(mapData) {
  const mapVideosConfig = MAPS_VIDEOS.find((config) =>
    config.mapsIds.includes(mapData?.CpID)
  );
  if (!mapVideosConfig) return [];

  const hasRoutes = mapVideosConfig?.mapHasRoutes;
  if (!hasRoutes) return mapVideosConfig.videos || [];

  return mapVideosConfig.videos.filter(
    (video) => video.route === mapData.Ender
  );
}

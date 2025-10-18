import s from "./MapDetailVideos.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaps } from "@/Redux/thunks/mapsThunk";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const VideoCard = ({ video }) => {
  const [oEmbedData, setOEmbedData] = useState(null);
  
  let videoUrl;
  try {
    videoUrl = new URL(video.videoUrl);
  } catch (err) {
    return <div>Error: Invalid video URL</div>;
  }

  const videoId = videoUrl.searchParams.get("v");
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${videoUrl}&format=json`;

  useEffect(() => {
    let isMounted = true;

    async function loadOEmbed() {
      try {
        const res = await fetch(oEmbedUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) setOEmbedData(data);
      } catch (err) {
        // do nothing
      }
    }

    loadOEmbed();
    return () => {
      isMounted = false;
    };
  }, [oEmbedUrl]);

  return (
    <div className={s.videoCard}>
      <a href={videoUrl} className={s.youtubeLink} target="_blank" rel="noopener noreferrer">
        <img className={s.videoThumbnail} src={thumbnailUrl} />
        {
          oEmbedData && <div>
              <h3 className={s.videoTitle}>{oEmbedData.title}</h3>
              <div className={s.videoAuthor}>{oEmbedData.author_name}</div>
          </div>
        }
      </a>
    </div>
  );
};

const MapDetailVideos = ({ mapData }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    dispatch(fetchMaps(paramsObject));
  }, [searchParams]);

  const allMaps = useSelector((s) => s.maps.mapsData);
  var extendedMapData = allMaps.find(x => x.ID == mapData.ID);
  var videos = extendedMapData ? extendedMapData.Videos : [];
  var videoExists = videos != null && videos.length > 0;

  return (
    <div className={s.videosSection}>
      <div className={s.videosSectionHeader}>
        <span className={s.youtubeIcon}>
          <svg>
            <use href="/icons-sprite.svg#youtube" />
          </svg>
        </span>
        <span>Videos</span>
      </div>

      {videoExists ? (
        <div className={s.videosList}>
          {videos?.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p>There are no videos for this map.</p>
      )}
    </div>
  );
};

export default MapDetailVideos;

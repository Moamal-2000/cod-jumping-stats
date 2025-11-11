"use client";

import { MAPS_VIDEOS } from "@/Data/mapsVideos";
import { useEffect, useState } from "react";
import s from "./MapVideos.module.scss";
import Video from "./Video/Video";

const MapVideos = ({ mapId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = () => {
      try {
        const mapVideos =
          MAPS_VIDEOS.find((map) => map.mapId === mapId)?.videos || [];
        setVideos(mapVideos);
      } catch (err) {
        console.error("Error loading videos:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    if (mapId) fetchVideos();
  }, [mapId]);

  if (loading)
    return (
      <div className={s.loading}>
        <div className={s.spinner}></div>
        <p>Loading videos...</p>
      </div>
    );

  if (error) return <div className={s.error}>{error}</div>;

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

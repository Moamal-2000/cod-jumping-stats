"use client";

import { MAPS_VIDEOS } from "@/Data/mapsVideos";
import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./MapVideos.module.scss";

const VideoCard = ({ video }) => {
  const [oEmbedData, setOEmbedData] = useState(null);
  const [channelThumbnail, setChannelThumbnail] = useState("");

  let videoUrl;
  try {
    videoUrl = new URL(video.videoUrl);
  } catch {
    return null;
  }

  const videoId =
    videoUrl.searchParams.get("v") || videoUrl.pathname.split("/").pop();
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${video.videoUrl}&format=json`;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [oEmbedRes, videoRes] = await Promise.all([
          fetch(oEmbedUrl),
          fetch(`/api/youtube?videoId=${videoId}`),
        ]);

        if (!oEmbedRes.ok || !videoRes.ok) throw new Error("Request failed");

        const oEmbedJson = await oEmbedRes.json();
        const videoJson = await videoRes.json();
        const channelId = videoJson.items[0]?.snippet?.channelId;

        const channelRes = await fetch(`/api/youtube?channelId=${channelId}`);
        const channelJson = await channelRes.json();
        const channelImage =
          channelJson.items[0]?.snippet?.thumbnails?.high?.url ||
          channelJson.items[0]?.snippet?.thumbnails?.default?.url ||
          "";

        if (isMounted) {
          setOEmbedData(oEmbedJson);
          setChannelThumbnail(channelImage);
        }
      } catch (err) {
        console.error("Error loading video data:", err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [videoId, oEmbedUrl]);

  return (
    <div className={s.videoCard}>
      <a
        href={video.videoUrl}
        className={s.videoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={s.thumbnailContainer}>
          <Image
            src={thumbnailUrl}
            alt={oEmbedData?.title || video.type || "Video thumbnail"}
            width={320}
            height={180}
            className={s.thumbnail}
            priority
            quality={100}
          />
          <div className={s.overlayContent}>
            <div className={s.channelInfo}>
              {channelThumbnail && (
                <div className={s.channelAvatar}>
                  <Image
                    src={channelThumbnail}
                    alt={oEmbedData?.author_name || "Channel"}
                    width={36}
                    height={36}
                    className={s.channelImage}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
              <span className={s.videoTitleOverlay}>
                {oEmbedData?.title || ""}
              </span>
            </div>
          </div>
          <div className={s.playButton}>
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                fill="red"
              />
              <path d="M45 24 27 14v20l18-10z" fill="white" />
            </svg>
          </div>
          {video.type && <span className={s.videoType}>{video.type}</span>}
        </div>
      </a>
    </div>
  );
};

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
        <VideoCard key={`${video.id}-${index}`} video={video} />
      ))}
    </div>
  );
};

export default MapVideos;

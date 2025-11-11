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
          {oEmbedData?.thumbnail_url && (
            <Image
              src={oEmbedData.thumbnail_url}
              alt={oEmbedData?.title || video.type || "Video thumbnail"}
              width={320}
              height={180}
              className={s.thumbnail}
              priority
              quality={100}
            />
          )}

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
            <svg aria-hidden="true">
              <use href="/icons-sprite.svg#youtube"></use>
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

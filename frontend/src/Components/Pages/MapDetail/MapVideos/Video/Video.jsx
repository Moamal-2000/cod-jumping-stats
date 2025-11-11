"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./Video.module.scss";

const Video = ({ video }) => {
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

export default Video;

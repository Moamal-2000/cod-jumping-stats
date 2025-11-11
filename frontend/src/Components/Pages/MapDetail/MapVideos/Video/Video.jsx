"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./Video.module.scss";
import VideoOverlay from "./VideoOverlay/VideoOverlay";

const Video = ({ video }) => {
  const [oEmbedData, setOEmbedData] = useState(null);
  const [channelThumbnail, setChannelThumbnail] = useState("");

  const { videoId, oEmbedUrl } = extractYouTubeVideoInfo(video);

  useEffect(() => {
    async function fetchYouTubeVideoData() {
      try {
        const [oEmbedRes, videoRes] = await Promise.all([
          fetch(oEmbedUrl),
          fetch(`/api/youtube?videoId=${videoId}`),
        ]);

        if (!oEmbedRes.ok && !videoRes.ok)
          throw new Error("Failed to fetch YouTube data");

        const [oEmbedJson, videoJson] = [
          await oEmbedRes.json(),
          await videoRes.json(),
        ];

        const channelImage = await fetchChannelThumbnail(videoJson);

        setOEmbedData(oEmbedJson);
        setChannelThumbnail(channelImage);
      } catch (err) {
        console.error("Error loading video data:", err);
      }
    }

    fetchYouTubeVideoData();
  }, []);

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

          <VideoOverlay
            oEmbedData={oEmbedData}
            channelThumbnail={channelThumbnail}
          />

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

function extractYouTubeVideoInfo(video) {
  if (!video) return { videoId: "", oEmbedUrl: "" };

  const videoUrl = new URL(video.videoUrl);
  const videoId =
    videoUrl.searchParams.get("v") || videoUrl.pathname.split("/").pop();
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${video.videoUrl}&format=json`;

  return { videoId, oEmbedUrl };
}

async function fetchChannelThumbnail(videoJson) {
  const channelId = videoJson.items[0]?.snippet?.channelId;
  if (!channelId) return "";

  try {
    const channelRes = await fetch(`/api/youtube?channelId=${channelId}`);
    const channelJson = await channelRes.json();
    const channelThumbnails = channelJson.items[0]?.snippet?.thumbnails;

    return (
      channelThumbnails?.high?.url ||
      channelThumbnails?.default?.url ||
      channelThumbnails?.medium?.url ||
      ""
    );
  } catch (err) {
    console.error("Error fetching channel thumbnail:", err);
    return "";
  }
}

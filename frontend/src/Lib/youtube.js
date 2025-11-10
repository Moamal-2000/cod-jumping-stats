export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export function buildYouTubeApiUrl({ videoId, channelId }) {
  if (channelId) {
    return `${BASE_URL}/channels?part=snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
  }

  if (videoId) {
    return `${BASE_URL}/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  }

  return null;
}

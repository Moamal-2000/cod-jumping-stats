import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function GET(req) {
  if (!API_KEY) return jsonError("Missing YouTube API key", 500);

  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const channelId = searchParams.get("channelId");

    const apiUrl = buildYouTubeApiUrl({ videoId, channelId });
    if (!apiUrl) return jsonError("Missing videoId or channelId", 400);

    const res = await fetch(apiUrl);
    if (!res.ok) return jsonError("Failed to fetch YouTube data", res.status);

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("YouTube API Error:", err);
    return jsonError("Internal Server Error", 500);
  }
}

function buildYouTubeApiUrl({ videoId, channelId }) {
  if (channelId) {
    return `${BASE_URL}/channels?part=snippet&id=${channelId}&key=${API_KEY}`;
  }

  if (videoId) {
    return `${BASE_URL}/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
  }

  return null;
}

function jsonError(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

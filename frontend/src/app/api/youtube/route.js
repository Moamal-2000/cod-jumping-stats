import { YOUTUBE_API_KEY, buildYouTubeApiUrl } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (!YOUTUBE_API_KEY) return jsonError("Missing YouTube API key", 500);

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

function jsonError(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

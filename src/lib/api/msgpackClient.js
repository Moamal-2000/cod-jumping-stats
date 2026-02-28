import { decode } from "msgpackr";

export function fetchMsgPackResponse({ url, cache = "no-store" } = {}) {
  return fetch(url, {
    headers: { Accept: "application/msgpack", "Accept-Encoding": "gzip" },
    cache,
  });
}

export async function decodeAsyncData(response, datatype = "arraybuffer") {
  try {
    if (!response || !response.ok) {
      console.warn(
        "Invalid response in decodeAsyncData:",
        response?.status,
        response?.statusText,
      );
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return decode(
      datatype === "arraybuffer" ? arrayBuffer : new Uint8Array(arrayBuffer),
    );
  } catch (error) {
    console.error("Error decoding data:", error);
    console.error("Response status:", response?.status);
    console.error("Response headers:", response?.headers);
    return null;
  }
}

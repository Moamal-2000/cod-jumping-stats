import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";

export const baseQueryMsgPack = async ({ url }) => {
  try {
    const response = await fetchMsgPackResponse({ url });
    return (await decodeAsyncData(response)) ?? {};
  } catch (error) {
    return { error };
  }
};

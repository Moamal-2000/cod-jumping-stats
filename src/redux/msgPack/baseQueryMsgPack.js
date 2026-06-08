import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";

export const baseQueryMsgPack = async ({ url }) => {
  try {
    const response = await fetchMsgPackResponse({ url });
    const data = (await decodeAsyncData(response)) ?? {};

    return {
      ...data,
      __status: response?.status,
    };
  } catch (error) {
    return { error };
  }
};

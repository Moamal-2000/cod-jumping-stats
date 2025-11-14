import { decodeAsyncData, fetchMsgPackResponse } from "@/functions/utils";

export const baseQueryMsgPack = async ({ url }) => {
  try {
    const response = await fetchMsgPackResponse({ url });
    const data = await decodeAsyncData(response);

    return { data: data.Servers };
  } catch (error) {
    return { error };
  }
};

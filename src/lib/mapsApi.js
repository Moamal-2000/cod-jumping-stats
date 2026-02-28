import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "./msgpackClient";

export async function getMapByCpId(cpid, datatype) {
  if (cpid === undefined) {
    console.error("map cpid is undefined");
    return null;
  }

  const response = await fetchMsgPackResponse({ url: jhApis().map.allMaps });
  const maps = (await decodeAsyncData(response, datatype)) ?? [];

  return maps.find((map) => +map.CpID === +cpid);
}

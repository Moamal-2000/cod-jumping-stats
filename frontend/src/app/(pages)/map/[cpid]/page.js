import { jhApis } from "@/Api/jumpersHeaven";
import MapDetailPage from "@/Components/Pages/MapDetail/MapDetailPage";
import { decodeAsyncData, fetchMsgPackResponse } from "@/Functions/utils";

export async function generateMetadata({ params }) {
  const { cpid } = await params;

  const response = await fetchMsgPackResponse({ url: jhApis().map.getAllMaps });
  const data = await decodeAsyncData(response);
  const map = data.find((map) => map.CpID === +cpid);

  return {
    title: `${map.Name} | JumpersHeaven`,
  };
}

async function MapPage({ params }) {
  const { cpid } = await params;
  return <MapDetailPage cpid={cpid} />;
}

export default MapPage;

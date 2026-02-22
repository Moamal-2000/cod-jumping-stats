import MapDetailPage from "@/components/Pages/MapDetail/MapDetailPage";
import s from "@/components/Pages/MapDetail/MapPage.module.scss";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";
import Link from "next/link";
import { Suspense } from "react";

const title = "Map | JumpersHeaven";
const description = "View JumpersHeaven map details and statistics.";

export const metadata = {
  title,
  description,
  keyword: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-map.webp`,
    imageAlt: "Jumpers Heaven Map",
  }),
};

async function MapPage({ searchParams }) {
  const { mapid } = await searchParams;
  const mapIdExist = mapid !== undefined;

  return (
    <>
      {!mapIdExist && (
        <main>
          <div className="container">
            <section className={s.heroSection}>
              <h1>Maps Overview</h1>
              <p>
                Explore all jumpers heaven <Link href="/maps">maps</Link>. Click
                on a map to see detailed statistics and information.
              </p>
            </section>
          </div>
        </main>
      )}

      {mapIdExist && (
        <Suspense fallback={<div>Loading...</div>}>
          <MapDetailPage />
        </Suspense>
      )}
    </>
  );
}

export default MapPage;

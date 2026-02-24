import s from "@/components/Pages/MapDetail/MapPage.module.scss";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";
import Link from "next/link";

const title = "Map | JumpersHeaven";
const description = "View JumpersHeaven map details and statistics.";

export const metadata = {
  title,
  description,
  keywords: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-map.webp`,
    imageAlt: "Jumpers Heaven Map",
  }),
};

function MapPage() {
  return (
    <main>
      <div className="container">
        <section className={s.heroSection}>
          <h1>Maps Overview</h1>
          <p>
            Explore all jumpers heaven <Link href="/maps">maps</Link>. Click on
            a map to see detailed statistics and information.
          </p>
        </section>
      </div>
    </main>
  );
}

export default MapPage;

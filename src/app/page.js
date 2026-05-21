import ServersPage from "@/components/Pages/ServersPage/ServersPage";
import { METADATA, SITE_URL } from "@/data/metadata";
import { getOpenGraphMetadata } from "@/lib/metadata";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const title = "Servers | JumpersHeaven";
const description =
  "Browse active JumpersHeaven mod servers, monitor live player counts, and quickly jump to server-specific activity.";

export const metadata = {
  title,
  description,
  keywords: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-servers.webp`,
    imageAlt: "Jumpers Heaven Servers",
  }),
};

export default async function Servers() {
  return (
    <div className="container">
      <main>
        <Suspense>
          <ServersPage />
        </Suspense>
      </main>
    </div>
  );
}

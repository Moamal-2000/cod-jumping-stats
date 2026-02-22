import About from "@/components/Pages/About/About";
import { getOpenGraphMetadata, METADATA, SITE_URL } from "@/data/metadata";

const title = "About | JumpersHeaven";
const description =
  "Learn about JH Stats, the independent JumpersHeaven Stats platform, including data sources, development team, and community-focused player stats and map completion tracking.";

export const metadata = {
  title,
  description,
  keywords: METADATA.keywords,
  ...getOpenGraphMetadata({
    title,
    description,
    imageUrl: `${SITE_URL}/openGraph/og-image-about.webp`,
    imageAlt: "Jumpers Heaven About",
  }),
};

const AboutPage = () => {
  return <About />;
};

export default AboutPage;

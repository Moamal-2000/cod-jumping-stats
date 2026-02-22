export const SITE_URL = process.env.SITE_URL;
const title = "Statistics | JumpersHeaven";

const keywords = [
  "Jumpers Heaven",
  "Jumpers Heaven Stats",
  "Jumpers Heaven Leaderboards",
  "Jumpers Heaven Players",
  "Jumpers Heaven Maps",
  "JH Stats",
  "JH Leaderboards",
  "Call of Duty 2 Jumpers Heaven",
  "CoD2 Jumpers Heaven",
  "CoD2 Jumper Stats",
  "Call of Duty 2 Leaderboards",
  "Call of Duty 2 Player Stats",
  "CoD2 Records",
  "CoD2 Maps",
  "Jumper Mod CoD2",
  "Jumping Mod Call of Duty 2",
  "Game Server Statistics",
];

const description =
  "JumpersHeaven statistics platform for tracking servers, players, maps, favorites, and leaderboard performance.";

export function getOpenGraphMetadata({
  pagePath = "",
  title,
  description,
  imageUrl = `${SITE_URL}/openGraph/og-image.webp`,
  imageType = "image/webp",
  imageAlt = "",
  imageSize = { width: 1300, height: 520 },
} = {}) {
  const url = pagePath ? `${SITE_URL}/${pagePath}` : SITE_URL;

  return {
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "en_US",
      siteName: "Jumpers Heaven Stats",
      authors: ["Moamal Alaa", "Dcoy"],
      images: [
        {
          url: imageUrl,
          type: imageType,
          alt: imageAlt,
          ...imageSize,
        },
      ],
    },
  };
}

export const METADATA = {
  title,
  description,
  keywords,
  ...getOpenGraphMetadata(),
};

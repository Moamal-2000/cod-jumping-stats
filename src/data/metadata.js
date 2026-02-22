export const SITE_URL = process.env.SITE_URL;
const title = "Servers | JumpersHeaven";

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
  "Browse active JumpersHeaven mod servers, monitor live player counts, and quickly jump to server-specific activity.";

export function getOpenGraphMetadata(pagePath = "") {
  const url = pagePath ? `${SITE_URL}/${pagePath}` : SITE_URL;

  return {
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "en_US",
      siteName: "Moamal Alaa Portfolio",
      authors: ["Moamal Alaa"],
      images: [
        {
          url: `${SITE_URL}/og-image.webp`,
          type: "image/webp",
          alt: "Moamal Alaa Front-End Engineer Portfolio OG Image",
          width: 1200,
          height: 634,
        },
      ],
    },
  };
}

export const METADATA = { title, description, keywords };

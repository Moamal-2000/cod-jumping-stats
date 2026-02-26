import { SITE_URL } from "@/data/metadata";
import {
  formateDateExcludeTime,
  getCleanMapName,
  getFormattedCountryName,
  getMapAverageDifficulty,
  isNewMap,
  stripColorCodes,
} from "./utils";

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

export function getPlayerSeoDescription(player = {}) {
  if (!player?.PlayerID) return "Player profile and statistics.";

  const parts = [];
  const purePlayerName = stripColorCodes(player.PrefName || player.PlayerName);
  const countryName = player.Country
    ? getFormattedCountryName(player.Country)
    : "Unknown Country";

  if (player.Banned) {
    parts.push(
      `${purePlayerName} is currently banned from the JumpersHeaven server.`,
    );
  }

  if (player.PlayerID === 1) {
    parts.push(`${purePlayerName} is the owner of JumpersHeaven.`);
  }

  let mainSentence = `${purePlayerName} is a player`;

  if (player.Country) {
    mainSentence += ` from ${countryName}`;
  }

  mainSentence += ` with ID ${player.PlayerID}`;

  if (player.Admin && player.Admin > 0) {
    mainSentence += ` and an admin level of ${player.Admin}`;
  }

  mainSentence += ".";

  parts.push(mainSentence);

  if (player.Donated) {
    parts.push(
      `${purePlayerName} is a supporter who has donated to the JumpersHeaven servers.`,
    );
  }

  if (player.Visits) {
    parts.push(
      `${purePlayerName} has visited the server ${player.Visits.toLocaleString()} times.`,
    );
  }

  if (player.LastSeen) {
    const lastSeenPureDate = formateDateExcludeTime(player.LastSeen);
    parts.push(`${purePlayerName} was last seen on ${lastSeenPureDate}.`);
  }

  if (!player.Banned) {
    parts.push(`${purePlayerName} is currently not banned.`);
  }

  return parts.join(" ");
}

export function getPlayerOgDescription(player = {}) {
  if (!player?.PlayerID) {
    return "View player stats, rankings, and achievements on JumpersHeaven.";
  }

  const purePlayerName = stripColorCodes(
    player.PrefName || player.PlayerName || "This player",
  );

  const parts = [];

  if (player.Banned) {
    parts.push(`${purePlayerName} is currently banned.`);
  }

  if (player.PlayerID === 1) {
    parts.push(`${purePlayerName} is the owner of JumpersHeaven.`);
  }

  let sentence = `Explore ${purePlayerName}'s stats, rankings, and achievements`;

  if (player.Country) {
    const countryName = getFormattedCountryName(player.Country);
    sentence += ` from ${countryName}`;
  }

  sentence += ".";
  parts.push(sentence);

  if (player.Visits) {
    parts.push(
      `Visited ${player.Visits.toLocaleString()} times on the server.`,
    );
  }

  if (player.Admin && player.Admin > 0) {
    parts.push(`Server admin level ${player.Admin}.`);
  }

  if (player.LastSeen) {
    const lastSeenPureDate = formateDateExcludeTime(player.LastSeen);
    parts.push(`Last active on ${lastSeenPureDate}.`);
  }

  return parts.join(" ");
}

export function getMapOgDescription(map = {}) {
  if (!map?.ID) return "Discover maps, records, and rankings on JumpersHeaven.";

  const mapName = getCleanMapName(map.Name || "This map");
  const author = map.Author || null;

  const parts = [];

  let sentence = `Explore ${mapName}`;

  if (author) sentence += ` by ${author}`;
  sentence += ` on JumpersHeaven.`;
  parts.push(sentence);

  const difficulties = map.Difficulty ? Object.values(map.Difficulty) : [];
  if (difficulties.length > 0) {
    const avgDifficulty = getMapAverageDifficulty(map);

    parts.push(
      `Difficulty${avgDifficulty <= 0 ? " is unknown yet." : ` around ${avgDifficulty.toFixed(2)}.`}`,
    );
  }

  if (map.IndividualFinishCount) {
    parts.push(
      `${map.IndividualFinishCount.toLocaleString()} players completed this map.`,
    );
  }

  parts.push("View records, stats, and rankings now.");

  return parts.join(" ");
}

export function getMapSeoDescription(map = {}) {
  if (!map?.ID)
    return "Explore map statistics, difficulty, and player records on JumpersHeaven.";

  const mapName = getCleanMapName(map.Name || "Unknown Map");
  const author = map.Author || "Unknown author";
  const type = map.Type || "jump";
  const newMap = isNewMap(map.Released);

  const parts = [];

  let mainSentence = `${mapName} is a${newMap ? " new" : ""} ${type} map created by ${author}`;

  if (map.CpID) {
    mainSentence += ` with ID ${map.CpID}`;
  }

  mainSentence += ".";
  parts.push(mainSentence);

  const difficulties = map.Difficulty ? Object.values(map.Difficulty) : [];

  if (difficulties.length > 0) {
    const avgDifficulty = getMapAverageDifficulty(map);

    parts.push(
      `The average difficulty is${avgDifficulty <= 0 ? " unknown yet." : ` approximately ${avgDifficulty.toFixed(2)}.`}`,
    );
  }

  if (map.IndividualFinishCount) {
    parts.push(
      `${mapName} has been completed by ${map.IndividualFinishCount.toLocaleString()} players.`,
    );
  }

  parts.push(
    `View records, rankings, and player statistics for ${mapName} on JumpersHeaven.`,
  );

  return parts.join(" ");
}

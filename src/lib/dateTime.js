import { MONTHS } from "@/data/constants";

export function getTimeObj(getSeconds) {
  const totalMinutes = Math.floor(getSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = getSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export function toSecondsFlexible(timeStr = "") {
  const parts = timeStr.split(":").map(Number);
  let seconds = 0;

  for (let i = 0; i < parts.length; i++) {
    const indexFromRight = parts.length - 1 - i;
    if (i === 0) {
      seconds += parts[indexFromRight];
    } else if (i === 1) {
      seconds += parts[indexFromRight] * 60;
    } else if (i === 2) {
      seconds += parts[indexFromRight] * 3600;
    } else if (i === 3) {
      seconds += parts[indexFromRight] * 3600 * 24;
    }
  }

  return seconds;
}

export function formatTimeBySeconds(seconds) {
  const { days, hours, minutes, seconds: sec } = getTimeObj(seconds);

  if (days > 0) return `${days}:${hours}:${minutes}:${sec}`;
  if (hours > 0) return `${hours}:${minutes}:${sec}`;
  if (minutes > 0) return `${minutes}:${sec}`;
  if (seconds > 0) return `${sec}`;

  return seconds || 0;
}

export function formatDate(dateStr, fallback) {
  if (!dateStr) return fallback;

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString();
}

export function formatDateExcludeTime(dateString) {
  if (!dateString) return null;

  const isoString = dateString.replace(" ", "T");
  const date = new Date(isoString);

  if (isNaN(date)) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formateReleaseDate(dateStr) {
  if (!dateStr) return "Unknown";
  const [year, month, day] = dateStr.split("-");
  return `${MONTHS[+month]} ${day}, ${year}`;
}

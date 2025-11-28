export function isMobile() {
  if (typeof navigator === "undefined") return;

  const mobilesType = /Mobi|Android|iPhone|iPad|iPod/i;
  return mobilesType.test(navigator.userAgent);
}

export function isActiveWithinWeek(lastSeen) {
  const lastSeenDate = new Date(lastSeen);
  const afterWeek = lastSeenDate.getTime() + 7 * 24 * 60 * 60 * 1000;
  const afterWeekDate = new Date(afterWeek);
  return afterWeekDate.getTime() > Date.now();
}

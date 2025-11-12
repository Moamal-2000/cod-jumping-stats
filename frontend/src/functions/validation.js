export function isMobile() {
  if (typeof navigator === "undefined") return;

  const mobilesType = /Mobi|Android|iPhone|iPad|iPod/i;
  return mobilesType.test(navigator.userAgent);
}

export function formatRemainingTime(executeAfter: number) {
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const remainingSeconds = executeAfter - now;

  if (remainingSeconds <= 0) {
    return "0min";
  }

  const days = Math.floor(remainingSeconds / (24 * 3600));
  const hours = Math.floor((remainingSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);

  const parts = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}min`);
  }

  return parts.join(" ");
}

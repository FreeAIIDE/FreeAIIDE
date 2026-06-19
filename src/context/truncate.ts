export function truncateMiddle(value: string, maxChars: number): string {
  if (value.length <= maxChars) {
    return value;
  }
  const half = Math.floor((maxChars - 32) / 2);
  return `${value.slice(0, half)}\n...[truncated]...\n${value.slice(-half)}`;
}

export function sliceLineRange(text: string, requestedStartLine?: number, requestedEndLine?: number): { startLine: number; endLine: number; content: string } {
  const lines = text.split(/\r?\n/);
  const startLine = Math.max(requestedStartLine ?? 1, 1);
  const endLine = Math.min(requestedEndLine ?? lines.length, lines.length);
  return {
    startLine,
    endLine,
    content: lines.slice(startLine - 1, endLine).join('\n')
  };
}

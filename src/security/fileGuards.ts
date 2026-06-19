import * as vscode from 'vscode';

export const MAX_READ_BYTES = 256 * 1024;

export async function ensureReadableTextFile(uri: vscode.Uri, maxBytes = MAX_READ_BYTES): Promise<void> {
  const stat = await vscode.workspace.fs.stat(uri);
  if (stat.type !== vscode.FileType.File) {
    throw new Error('Path is not a file.');
  }
  if (stat.size > maxBytes) {
    throw new Error(`File is too large to read safely (${stat.size} bytes).`);
  }
}

export function rejectBinaryContent(content: Uint8Array): void {
  const sample = content.slice(0, Math.min(content.length, 4096));
  if (sample.includes(0)) {
    throw new Error('Binary files are blocked.');
  }
}

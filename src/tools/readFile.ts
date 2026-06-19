import * as vscode from 'vscode';
import { ensureReadableTextFile, rejectBinaryContent } from '../security/fileGuards';
import { resolveWorkspacePath } from '../security/workspacePath';

interface ReadFileInput {
  path: string;
  startLine?: number;
  endLine?: number;
}

export async function readFile(input: unknown): Promise<unknown> {
  const parsed = input as ReadFileInput;
  if (!parsed?.path) {
    throw new Error('read_file requires a path.');
  }

  const resolved = resolveWorkspacePath(parsed.path);
  await ensureReadableTextFile(resolved.uri);
  const bytes = await vscode.workspace.fs.readFile(resolved.uri);
  rejectBinaryContent(bytes);
  const text = new TextDecoder().decode(bytes);
  const lines = text.split(/\r?\n/);
  const startLine = Math.max(parsed.startLine ?? 1, 1);
  const endLine = Math.min(parsed.endLine ?? lines.length, lines.length);

  return {
    path: resolved.relativePath,
    startLine,
    endLine,
    content: lines.slice(startLine - 1, endLine).join('\n')
  };
}

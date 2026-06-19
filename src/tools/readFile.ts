import * as vscode from 'vscode';
import { ensureReadableTextFile, rejectBinaryContent } from '../security/fileGuards';
import { resolveWorkspacePath } from '../security/workspacePath';
import { sliceLineRange } from './lineRange';

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
  const sliced = sliceLineRange(text, parsed.startLine, parsed.endLine);

  return {
    path: resolved.relativePath,
    startLine: sliced.startLine,
    endLine: sliced.endLine,
    content: sliced.content
  };
}

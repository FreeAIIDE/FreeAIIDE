import * as vscode from 'vscode';
import { isExcludedPath } from '../security/exclusions';
import { isSensitivePath, toPosix } from '../security/sensitiveFiles';

interface ListFilesInput {
  glob?: string;
  limit?: number;
}

export async function listFiles(input: unknown): Promise<unknown> {
  const parsed = (input ?? {}) as ListFilesInput;
  const glob = parsed.glob && !parsed.glob.includes('..') ? parsed.glob : '**/*';
  const limit = Math.min(Math.max(parsed.limit ?? 100, 1), 500);
  const uris = await vscode.workspace.findFiles(glob, '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/out/**,**/.next/**,**/.nuxt/**,**/coverage/**,**/vendor/**,**/.cache/**,**/.turbo/**,**/.parcel-cache/**}', limit);
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    throw new Error('No workspace folder is open.');
  }

  return {
    files: uris
      .map((uri) => toPosix(vscode.workspace.asRelativePath(uri, false)))
      .filter((file) => !isExcludedPath(file) && !isSensitivePath(file))
  };
}

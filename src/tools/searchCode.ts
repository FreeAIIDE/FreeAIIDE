import * as vscode from 'vscode';
import { ensureReadableTextFile, rejectBinaryContent } from '../security/fileGuards';
import { isExcludedPath } from '../security/exclusions';
import { isSensitivePath, toPosix } from '../security/sensitiveFiles';

interface SearchCodeInput {
  query: string;
  glob?: string;
  limit?: number;
}

export async function searchCode(input: unknown): Promise<unknown> {
  const parsed = input as SearchCodeInput;
  if (!parsed?.query) {
    throw new Error('search_code requires a query.');
  }

  const limit = Math.min(Math.max(parsed.limit ?? 50, 1), 200);
  const uris = await vscode.workspace.findFiles(parsed.glob ?? '**/*', '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/out/**,**/.next/**,**/.nuxt/**,**/coverage/**,**/vendor/**,**/.cache/**,**/.turbo/**,**/.parcel-cache/**}', 1000);
  const results: Array<{ path: string; line: number; preview: string }> = [];

  for (const uri of uris) {
    const relativePath = toPosix(vscode.workspace.asRelativePath(uri, false));
    if (isExcludedPath(relativePath) || isSensitivePath(relativePath)) {
      continue;
    }

    try {
      await ensureReadableTextFile(uri, 128 * 1024);
      const bytes = await vscode.workspace.fs.readFile(uri);
      rejectBinaryContent(bytes);
      const lines = new TextDecoder().decode(bytes).split(/\r?\n/);
      lines.forEach((line, index) => {
        if (results.length < limit && line.toLowerCase().includes(parsed.query.toLowerCase())) {
          results.push({ path: relativePath, line: index + 1, preview: line.trim().slice(0, 240) });
        }
      });
    } catch {
      continue;
    }

    if (results.length >= limit) {
      break;
    }
  }

  return { results };
}

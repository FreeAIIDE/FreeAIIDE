import * as path from 'path';
import { toPosix } from './sensitiveFiles';

export function normalizeWorkspaceRelativePath(inputPath: string): string {
  if (!inputPath || path.isAbsolute(inputPath)) {
    throw new Error('Path must be workspace-relative.');
  }

  const normalized = path.posix.normalize(toPosix(inputPath));
  if (normalized === '.' || normalized.startsWith('../') || normalized === '..') {
    throw new Error('Path traversal is not allowed.');
  }
  return normalized;
}

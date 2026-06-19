import * as path from 'path';
import * as vscode from 'vscode';
import { isExcludedPath } from './exclusions';
import { isSensitivePath, toPosix } from './sensitiveFiles';

export interface ResolvedWorkspacePath {
  workspaceFolder: vscode.WorkspaceFolder;
  relativePath: string;
  uri: vscode.Uri;
}

export function getPrimaryWorkspaceFolder(): vscode.WorkspaceFolder {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    throw new Error('No workspace folder is open.');
  }
  return folder;
}

export function resolveWorkspacePath(inputPath: string, options: { allowMissing?: boolean } = {}): ResolvedWorkspacePath {
  if (!inputPath || path.isAbsolute(inputPath)) {
    throw new Error('Path must be workspace-relative.');
  }

  const normalized = path.posix.normalize(toPosix(inputPath));
  if (normalized === '.' || normalized.startsWith('../') || normalized === '..') {
    throw new Error('Path traversal is not allowed.');
  }
  if (isSensitivePath(normalized)) {
    throw new Error('Sensitive files are blocked by default.');
  }
  if (isExcludedPath(normalized)) {
    throw new Error('Excluded directories are blocked by default.');
  }

  const workspaceFolder = getPrimaryWorkspaceFolder();
  const uri = vscode.Uri.joinPath(workspaceFolder.uri, ...normalized.split('/'));
  const workspacePath = workspaceFolder.uri.fsPath;
  const resolvedPath = uri.fsPath;
  const relative = path.relative(workspacePath, resolvedPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Resolved path escapes the workspace.');
  }

  if (!options.allowMissing) {
    // Existence is checked by the caller so it can choose file or directory behavior.
  }

  return { workspaceFolder, relativePath: normalized, uri };
}

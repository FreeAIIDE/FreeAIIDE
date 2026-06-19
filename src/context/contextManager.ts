import * as vscode from 'vscode';
import { getSettings } from '../config/settings';
import { isSensitivePath, toPosix } from '../security/sensitiveFiles';
import { truncateMiddle } from './truncate';
import { WorkspaceContext } from './types';

export class ContextManager {
  build(): WorkspaceContext {
    const editor = vscode.window.activeTextEditor;
    const workspaceName = vscode.workspace.name ?? 'unknown';
    if (!editor) {
      return { workspaceName, activeFilePath: '', languageId: '', selection: '', nearbyCode: '', diagnostics: '' };
    }

    const relativePath = toPosix(vscode.workspace.asRelativePath(editor.document.uri, false));
    if (isSensitivePath(relativePath)) {
      return {
        workspaceName,
        activeFilePath: relativePath,
        languageId: editor.document.languageId,
        selection: '[blocked sensitive file]',
        nearbyCode: '[blocked sensitive file]',
        diagnostics: ''
      };
    }

    const selection = editor.document.getText(editor.selection);
    const cursorLine = editor.selection.active.line;
    const start = Math.max(cursorLine - 40, 0);
    const end = Math.min(cursorLine + 40, editor.document.lineCount - 1);
    const nearbyCode = editor.document.getText(new vscode.Range(start, 0, end, editor.document.lineAt(end).text.length));
    const diagnostics = vscode.languages
      .getDiagnostics(editor.document.uri)
      .slice(0, 20)
      .map((diagnostic) => `${diagnostic.range.start.line + 1}: ${diagnostic.message}`)
      .join('\n');
    const settings = getSettings();

    return {
      workspaceName,
      activeFilePath: relativePath,
      languageId: editor.document.languageId,
      selection: truncateMiddle(selection, Math.floor(settings.maxContextChars * 0.25)),
      nearbyCode: truncateMiddle(nearbyCode, Math.floor(settings.maxContextChars * 0.5)),
      diagnostics: truncateMiddle(diagnostics, Math.floor(settings.maxContextChars * 0.25))
    };
  }

  render(userMessage: string): string {
    const context = this.build();
    return `Current workspace:
${context.workspaceName}

Active file:
${context.activeFilePath}

Language:
${context.languageId}

Selection:
${context.selection}

Nearby code:
${context.nearbyCode}

Diagnostics:
${context.diagnostics}

User request:
${userMessage}`;
  }
}

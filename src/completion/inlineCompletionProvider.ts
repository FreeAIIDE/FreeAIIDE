import * as vscode from 'vscode';
import { ensureCloudContextAllowed } from '../config/cloudWarning';
import { getSettings } from '../config/settings';
import { createProvider } from '../providers/providerFactory';
import { truncateMiddle } from '../context/truncate';

export class FreeAIInlineCompletionProvider implements vscode.InlineCompletionItemProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionList | undefined> {
    const settings = getSettings();
    if (!settings.autocompleteEnabled) {
      return undefined;
    }
    if (!(await ensureCloudContextAllowed(this.context))) {
      return undefined;
    }

    const prefix = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    const suffix = document.getText(new vscode.Range(position, document.positionAt(document.getText().length)));
    const prompt = `You are completing code inside an editor.

Return only the code that should be inserted at the cursor.
Do not wrap the answer in markdown.
Do not explain.
Do not repeat existing code.

File:
${vscode.workspace.asRelativePath(document.uri, false)}

Language:
${document.languageId}

Code before cursor:
${truncateMiddle(prefix, Math.floor(settings.autocompleteMaxChars * 0.65))}

Code after cursor:
${truncateMiddle(suffix, Math.floor(settings.autocompleteMaxChars * 0.35))}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), settings.autocompleteTimeoutMs);
    token.onCancellationRequested(() => controller.abort());

    try {
      const provider = await createProvider(this.context);
      let text = '';
      for await (const chunk of provider.streamChat({
        messages: [{ role: 'user', content: prompt }],
        signal: controller.signal
      })) {
        text += chunk;
      }
      const cleaned = text.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '');
      if (!cleaned.trim()) {
        return undefined;
      }
      return new vscode.InlineCompletionList([
        new vscode.InlineCompletionItem(cleaned, new vscode.Range(position, position))
      ]);
    } catch {
      return undefined;
    } finally {
      clearTimeout(timeout);
    }
  }
}

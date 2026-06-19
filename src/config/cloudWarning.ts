import * as vscode from 'vscode';
import { getSettings } from './settings';

const CLOUD_WARNING_KEY = 'freeai.cloudWarningAccepted';

export async function ensureCloudContextAllowed(context: vscode.ExtensionContext): Promise<boolean> {
  const settings = getSettings();
  if (settings.provider !== 'openai-compatible' || !settings.warnBeforeCloud) {
    return true;
  }
  if (context.globalState.get<boolean>(CLOUD_WARNING_KEY)) {
    return true;
  }

  const answer = await vscode.window.showWarningMessage(
    'FreeAI will send bounded workspace context, file paths, diagnostics, and tool results to your configured OpenAI-compatible endpoint.',
    { modal: true },
    'Allow',
    'Cancel'
  );
  if (answer === 'Allow') {
    await context.globalState.update(CLOUD_WARNING_KEY, true);
    return true;
  }
  return false;
}

import * as vscode from 'vscode';
import { clearOpenAICompatibleApiKey, setOpenAICompatibleApiKey } from '../config/secrets';

export function registerConfigCommands(context: vscode.ExtensionContext): vscode.Disposable[] {
  return [
    vscode.commands.registerCommand('freeai.setApiKey', async () => {
      const apiKey = await vscode.window.showInputBox({ prompt: 'OpenAI-compatible API key', password: true, ignoreFocusOut: true });
      if (apiKey) {
        await setOpenAICompatibleApiKey(context.secrets, apiKey);
        vscode.window.showInformationMessage('FreeAI API key saved in SecretStorage.');
      }
    }),
    vscode.commands.registerCommand('freeai.clearApiKey', async () => {
      await clearOpenAICompatibleApiKey(context.secrets);
      vscode.window.showInformationMessage('FreeAI API key cleared.');
    }),
    vscode.commands.registerCommand('freeai.selectProvider', async () => {
      const provider = await vscode.window.showQuickPick(['ollama', 'openai-compatible'], { placeHolder: 'Select FreeAI provider' });
      if (provider) {
        await vscode.workspace.getConfiguration('freeai').update('provider', provider, vscode.ConfigurationTarget.Global);
      }
    }),
    vscode.commands.registerCommand('freeai.setModel', async () => {
      const config = vscode.workspace.getConfiguration('freeai');
      const provider = config.get<string>('provider', 'ollama');
      const key = provider === 'openai-compatible' ? 'openai.model' : 'ollama.model';
      const model = await vscode.window.showInputBox({ prompt: `Model for ${provider}`, value: config.get<string>(key, '') });
      if (model) {
        await config.update(key, model, vscode.ConfigurationTarget.Global);
      }
    }),
    vscode.commands.registerCommand('freeai.testProvider', async () => {
      vscode.window.showInformationMessage('FreeAI provider test: open the chat and send a short message.');
    }),
    vscode.commands.registerCommand('freeai.toggleAutocomplete', async () => {
      const config = vscode.workspace.getConfiguration('freeai');
      await config.update('autocomplete.enabled', !config.get<boolean>('autocomplete.enabled', false), vscode.ConfigurationTarget.Global);
    })
  ];
}

import * as vscode from 'vscode';
import { getSettings } from '../config/settings';

export class FreeAIStatus implements vscode.Disposable {
  private readonly item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 90);
  private readonly disposables: vscode.Disposable[] = [this.item];

  constructor() {
    this.item.command = 'freeai.testProvider';
    this.item.tooltip = 'FreeAI provider status';
    this.update('idle');
    this.disposables.push(vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('freeai')) {
        this.update('idle');
      }
    }));
  }

  update(state: 'idle' | 'running' | 'error', detail?: string): void {
    const settings = getSettings();
    const icon = state === 'running' ? '$(sync~spin)' : state === 'error' ? '$(warning)' : '$(sparkle)';
    this.item.text = `${icon} FreeAI: ${settings.provider}`;
    this.item.tooltip = detail ?? `Provider: ${settings.provider}`;
    this.item.show();
  }

  dispose(): void {
    this.disposables.forEach((disposable) => disposable.dispose());
  }
}

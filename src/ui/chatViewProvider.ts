import * as vscode from 'vscode';
import { AgentLoop } from '../agent/agentLoop';
import { PatchManager } from '../patch/patchManager';
import { ExtensionToWebviewMessage, WebviewToExtensionMessage } from './messageProtocol';
import { getWebviewHtml } from './webviewHtml';

export class ChatViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'freeai.chatView';
  private view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly agentLoop: AgentLoop,
    private readonly patchManager: PatchManager
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = getWebviewHtml(webviewView.webview, this.extensionUri);
    webviewView.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) => this.handleMessage(message));
  }

  async show(): Promise<void> {
    await vscode.commands.executeCommand(`${ChatViewProvider.viewType}.focus`);
  }

  handleToolResult(result: unknown): void {
    const parsed = result as { ok?: boolean; tool?: string; result?: { proposalId?: string; path?: string; summary?: string } };
    if (parsed.ok && parsed.tool === 'propose_edit' && parsed.result?.proposalId && parsed.result.path) {
      this.post({
        type: 'editProposal',
        proposalId: parsed.result.proposalId,
        path: parsed.result.path,
        summary: parsed.result.summary ?? 'Proposed edit'
      });
    }
  }

  private post(message: ExtensionToWebviewMessage): void {
    void this.view?.webview.postMessage(message);
  }

  private async handleMessage(message: WebviewToExtensionMessage): Promise<void> {
    if (message.type === 'sendMessage') {
      this.post({ type: 'appendUser', text: message.text });
      this.post({ type: 'startAssistant' });
      try {
        await this.agentLoop.run(message.text, (chunk) => this.post({ type: 'appendAssistant', text: chunk }));
      } catch (error) {
        this.post({ type: 'error', text: error instanceof Error ? error.message : String(error) });
      }
      return;
    }

    if (message.type === 'approveEdit') {
      try {
        this.patchManager.approve(message.proposalId);
        await this.patchManager.apply(message.proposalId);
        this.post({ type: 'appendAssistant', text: `\nApplied ${message.proposalId}.` });
      } catch (error) {
        this.post({ type: 'error', text: error instanceof Error ? error.message : String(error) });
      }
      return;
    }

    if (message.type === 'rejectEdit') {
      this.post({ type: 'appendAssistant', text: `\nRejected ${message.proposalId}.` });
    }
  }
}

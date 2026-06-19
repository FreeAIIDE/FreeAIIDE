import * as vscode from 'vscode';
import { AgentLoop } from './agent/agentLoop';
import { registerConfigCommands } from './commands/configCommands';
import { ContextManager } from './context/contextManager';
import { FreeAIInlineCompletionProvider } from './completion/inlineCompletionProvider';
import { PatchManager } from './patch/patchManager';
import { ToolRegistry } from './tools/toolRegistry';
import { ChatViewProvider } from './ui/chatViewProvider';
import { FreeAIStatus } from './ui/status';

export function activate(context: vscode.ExtensionContext): void {
  const patchManager = new PatchManager(context);
  const toolRegistry = new ToolRegistry(patchManager);
  const contextManager = new ContextManager();
  const status = new FreeAIStatus();
  let chatProvider: ChatViewProvider;
  const agentLoop = new AgentLoop(context, contextManager, toolRegistry, status, (result) => chatProvider.handleToolResult(result));
  chatProvider = new ChatViewProvider(context.extensionUri, agentLoop, patchManager);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, chatProvider),
    vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, new FreeAIInlineCompletionProvider(context)),
    patchManager,
    status,
    vscode.commands.registerCommand('freeai.openChat', () => chatProvider.show()),
    ...registerConfigCommands(context)
  );
}

export function deactivate(): void {}

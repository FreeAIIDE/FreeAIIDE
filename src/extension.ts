import * as vscode from 'vscode';
import { AgentLoop } from './agent/agentLoop';
import { registerConfigCommands } from './commands/configCommands';
import { ContextManager } from './context/contextManager';
import { PatchManager } from './patch/patchManager';
import { ToolRegistry } from './tools/toolRegistry';
import { ChatViewProvider } from './ui/chatViewProvider';

export function activate(context: vscode.ExtensionContext): void {
  const patchManager = new PatchManager();
  const toolRegistry = new ToolRegistry(patchManager);
  const contextManager = new ContextManager();
  let chatProvider: ChatViewProvider;
  const agentLoop = new AgentLoop(context, contextManager, toolRegistry, (result) => chatProvider.handleToolResult(result));
  chatProvider = new ChatViewProvider(context.extensionUri, agentLoop, patchManager);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, chatProvider),
    vscode.commands.registerCommand('freeai.openChat', () => chatProvider.show()),
    ...registerConfigCommands(context)
  );
}

export function deactivate(): void {}

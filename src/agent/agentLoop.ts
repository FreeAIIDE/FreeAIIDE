import * as vscode from 'vscode';
import { getSettings } from '../config/settings';
import { ensureCloudContextAllowed } from '../config/cloudWarning';
import { ContextManager } from '../context/contextManager';
import { createProvider } from '../providers/providerFactory';
import { ChatMessage } from '../providers/types';
import { ToolRegistry } from '../tools/toolRegistry';
import { FreeAIStatus } from '../ui/status';
import { SYSTEM_PROMPT } from './prompts';
import { parseAgentResponse } from './toolCallParser';

export class AgentLoop {
  constructor(
    private readonly extensionContext: vscode.ExtensionContext,
    private readonly contextManager: ContextManager,
    private readonly toolRegistry: ToolRegistry,
    private readonly status: FreeAIStatus,
    private readonly onToolResult?: (result: unknown) => void
  ) {}

  async run(userMessage: string, onChunk: (chunk: string) => void): Promise<string> {
    if (!(await ensureCloudContextAllowed(this.extensionContext))) {
      const cancelled = 'Cancelled before sending context to the cloud provider.';
      onChunk(cancelled);
      return cancelled;
    }

    const settings = getSettings();
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: this.contextManager.render(userMessage) }
    ];

    let finalText = '';
    for (let turn = 0; turn <= settings.maxToolCalls; turn += 1) {
      try {
        this.status.update('running');
        const provider = await createProvider(this.extensionContext);
        let response = '';
        for await (const chunk of provider.streamChat({ messages })) {
          response += chunk;
        }
        this.status.update('idle', `${provider.name} ready`);

        const parsed = parseAgentResponse(response);
        if (parsed.type === 'tool_call' && turn < settings.maxToolCalls) {
          const result = await this.toolRegistry.run(parsed.tool, parsed.input);
          this.onToolResult?.(result);
          messages.push({ role: 'assistant', content: response });
          messages.push({ role: 'tool', content: JSON.stringify(result) });
          continue;
        }

        finalText = parsed.type === 'final' ? parsed.content : response;
        onChunk(finalText);
        return finalText;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.status.update('error', message);
        throw error;
      }
    }

    finalText = 'Stopped after the configured tool-call budget.';
    onChunk(finalText);
    return finalText;
  }
}

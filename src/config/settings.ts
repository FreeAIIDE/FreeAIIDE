import * as vscode from 'vscode';

export type ProviderKind = 'ollama' | 'openai-compatible';

export interface FreeAISettings {
  provider: ProviderKind;
  ollamaBaseUrl: string;
  ollamaModel: string;
  openAIBaseUrl: string;
  openAIModel: string;
  maxContextChars: number;
  maxToolCalls: number;
  excludeGlobs: string[];
  autocompleteEnabled: boolean;
  autocompleteMaxChars: number;
}

export function getSettings(): FreeAISettings {
  const config = vscode.workspace.getConfiguration('freeai');
  return {
    provider: config.get<ProviderKind>('provider', 'ollama'),
    ollamaBaseUrl: config.get<string>('ollama.baseUrl', 'http://localhost:11434'),
    ollamaModel: config.get<string>('ollama.model', 'qwen2.5-coder:7b'),
    openAIBaseUrl: config.get<string>('openai.baseUrl', ''),
    openAIModel: config.get<string>('openai.model', ''),
    maxContextChars: config.get<number>('context.maxChars', 24000),
    maxToolCalls: config.get<number>('tools.maxToolCalls', 8),
    excludeGlobs: config.get<string[]>('files.excludeGlobs', []),
    autocompleteEnabled: config.get<boolean>('autocomplete.enabled', false),
    autocompleteMaxChars: config.get<number>('autocomplete.maxChars', 6000)
  };
}

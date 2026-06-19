import * as vscode from 'vscode';
import { getSettings } from '../config/settings';
import { getOpenAICompatibleApiKey } from '../config/secrets';
import { AIProvider } from './types';
import { OllamaProvider } from './ollamaProvider';
import { OpenAICompatibleProvider } from './openAICompatibleProvider';

export async function createProvider(context: vscode.ExtensionContext): Promise<AIProvider> {
  const settings = getSettings();
  if (settings.provider === 'openai-compatible') {
    return new OpenAICompatibleProvider({
      baseUrl: settings.openAIBaseUrl,
      model: settings.openAIModel,
      apiKey: await getOpenAICompatibleApiKey(context.secrets)
    });
  }

  return new OllamaProvider({
    baseUrl: settings.ollamaBaseUrl,
    model: settings.ollamaModel
  });
}

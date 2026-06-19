import * as vscode from 'vscode';

const OPENAI_API_KEY = 'freeai.openai.apiKey';

export async function getOpenAICompatibleApiKey(secrets: vscode.SecretStorage): Promise<string | undefined> {
  return secrets.get(OPENAI_API_KEY);
}

export async function setOpenAICompatibleApiKey(secrets: vscode.SecretStorage, apiKey: string): Promise<void> {
  await secrets.store(OPENAI_API_KEY, apiKey);
}

export async function clearOpenAICompatibleApiKey(secrets: vscode.SecretStorage): Promise<void> {
  await secrets.delete(OPENAI_API_KEY);
}

import { AIProvider, ChatRequest } from './types';

interface OpenAICompatibleOptions {
  baseUrl: string;
  model: string;
  apiKey?: string;
}

export class OpenAICompatibleProvider implements AIProvider {
  readonly name = 'OpenAI-compatible';

  constructor(private readonly options: OpenAICompatibleOptions) {}

  async *streamChat(request: ChatRequest): AsyncIterable<string> {
    if (!this.options.baseUrl || !this.options.model) {
      throw new Error('OpenAI-compatible base URL and model must be configured first.');
    }
    if (!this.options.apiKey) {
      throw new Error('OpenAI-compatible API key is missing. Use FreeAI: Set API Key.');
    }

    const response = await fetch(`${this.options.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.options.apiKey}`
      },
      body: JSON.stringify({
        model: this.options.model,
        messages: request.messages,
        stream: true
      }),
      signal: request.signal
    });

    if (!response.ok || !response.body) {
      throw new Error(`OpenAI-compatible request failed (${response.status}).`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) {
          continue;
        }
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          return;
        }
        const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
        const chunk = parsed.choices?.[0]?.delta?.content;
        if (chunk) {
          yield chunk;
        }
      }
    }
  }
}

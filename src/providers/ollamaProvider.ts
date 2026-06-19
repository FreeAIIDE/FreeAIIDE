import { AIProvider, ChatRequest } from './types';

interface OllamaOptions {
  baseUrl: string;
  model: string;
}

export class OllamaProvider implements AIProvider {
  readonly name = 'Ollama';

  constructor(private readonly options: OllamaOptions) {}

  async *streamChat(request: ChatRequest): AsyncIterable<string> {
    const response = await fetch(`${this.options.baseUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.options.model,
        messages: request.messages,
        stream: true
      }),
      signal: request.signal
    });

    if (!response.ok || !response.body) {
      throw new Error(`Ollama request failed (${response.status}). Is Ollama running at ${this.options.baseUrl}?`);
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
        if (!trimmed) {
          continue;
        }
        const parsed = JSON.parse(trimmed) as { message?: { content?: string }; done?: boolean };
        if (parsed.message?.content) {
          yield parsed.message.content;
        }
      }
    }
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  signal?: AbortSignal;
}

export interface AIProvider {
  readonly name: string;
  streamChat(request: ChatRequest): AsyncIterable<string>;
}

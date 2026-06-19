import { AIProvider, ChatRequest } from './types';

export class MockProvider implements AIProvider {
  readonly name = 'Mock';

  async *streamChat(request: ChatRequest): AsyncIterable<string> {
    const latest = request.messages.at(-1)?.content ?? '';
    yield JSON.stringify({
      type: 'final',
      content: `Mock response is enabled. I received ${latest.length} characters of bounded workspace context.`
    });
  }
}

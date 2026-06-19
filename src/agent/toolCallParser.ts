export type ParsedAgentResponse =
  | { type: 'tool_call'; tool: string; input: unknown }
  | { type: 'final'; content: string }
  | { type: 'text'; content: string };

export function parseAgentResponse(content: string): ParsedAgentResponse {
  const trimmed = stripCodeFence(content.trim());
  try {
    const parsed = JSON.parse(trimmed) as { type?: string; tool?: string; input?: unknown; content?: string };
    if (parsed.type === 'tool_call' && parsed.tool) {
      return { type: 'tool_call', tool: parsed.tool, input: parsed.input ?? {} };
    }
    if (parsed.type === 'final') {
      return { type: 'final', content: parsed.content ?? '' };
    }
  } catch {
    return { type: 'text', content };
  }
  return { type: 'text', content };
}

function stripCodeFence(value: string): string {
  if (!value.startsWith('```')) {
    return value;
  }
  return value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

export interface ToolInvocation {
  tool: string;
  input: unknown;
}

export interface ToolResult {
  ok: boolean;
  tool: string;
  result?: unknown;
  error?: string;
}

export type ToolHandler = (input: unknown) => Promise<unknown>;

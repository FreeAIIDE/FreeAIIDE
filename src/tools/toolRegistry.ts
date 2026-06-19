import { PatchManager } from '../patch/patchManager';
import { createApplyEditTool } from './applyEdit';
import { listFiles } from './listFiles';
import { createProposeEditTool } from './proposeEdit';
import { readFile } from './readFile';
import { searchCode } from './searchCode';
import { ToolHandler, ToolResult } from './types';

export class ToolRegistry {
  private readonly tools = new Map<string, ToolHandler>();

  constructor(patchManager: PatchManager) {
    this.tools.set('list_files', listFiles);
    this.tools.set('read_file', readFile);
    this.tools.set('search_code', searchCode);
    this.tools.set('propose_edit', createProposeEditTool(patchManager));
    this.tools.set('apply_edit', createApplyEditTool(patchManager));
  }

  async run(tool: string, input: unknown): Promise<ToolResult> {
    const handler = this.tools.get(tool);
    if (!handler) {
      return { ok: false, tool, error: `Unknown tool: ${tool}` };
    }

    try {
      return { ok: true, tool, result: await handler(input) };
    } catch (error) {
      return {
        ok: false,
        tool,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

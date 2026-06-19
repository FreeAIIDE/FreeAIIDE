import { PatchManager } from '../patch/patchManager';

interface ProposeEditInput {
  path: string;
  summary?: string;
  replacement: string;
}

export function createProposeEditTool(patchManager: PatchManager) {
  return async function proposeEdit(input: unknown): Promise<unknown> {
    const parsed = input as ProposeEditInput;
    if (!parsed?.path || typeof parsed.replacement !== 'string') {
      throw new Error('propose_edit requires path and replacement.');
    }

    const proposal = await patchManager.propose(parsed.path, parsed.summary ?? 'Proposed edit', parsed.replacement);
    return {
      proposalId: proposal.id,
      path: proposal.path,
      summary: proposal.summary,
      status: 'pending_user_approval'
    };
  };
}

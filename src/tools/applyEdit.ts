import { PatchManager } from '../patch/patchManager';

interface ApplyEditInput {
  proposalId: string;
}

export function createApplyEditTool(patchManager: PatchManager) {
  return async function applyEdit(input: unknown): Promise<unknown> {
    const parsed = input as ApplyEditInput;
    if (!parsed?.proposalId) {
      throw new Error('apply_edit requires proposalId.');
    }
    await patchManager.apply(parsed.proposalId);
    return { proposalId: parsed.proposalId, status: 'applied' };
  };
}

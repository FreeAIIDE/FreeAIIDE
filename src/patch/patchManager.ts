import * as vscode from 'vscode';
import { resolveWorkspacePath } from '../security/workspacePath';
import { EditProposal } from './types';

export class PatchManager {
  private readonly proposals = new Map<string, EditProposal>();

  async propose(path: string, summary: string, replacement: string): Promise<EditProposal> {
    const resolved = resolveWorkspacePath(path, { allowMissing: true });
    const proposal: EditProposal = {
      id: `edit_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      path: resolved.relativePath,
      summary,
      replacement,
      approved: false,
      createdAt: Date.now()
    };
    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  get(id: string): EditProposal | undefined {
    return this.proposals.get(id);
  }

  approve(id: string): EditProposal {
    const proposal = this.proposals.get(id);
    if (!proposal) {
      throw new Error('Unknown edit proposal.');
    }
    proposal.approved = true;
    return proposal;
  }

  async apply(id: string): Promise<void> {
    const proposal = this.proposals.get(id);
    if (!proposal) {
      throw new Error('Unknown edit proposal.');
    }
    if (!proposal.approved) {
      throw new Error('Edit proposal has not been approved by the user.');
    }

    const resolved = resolveWorkspacePath(proposal.path, { allowMissing: true });
    const edit = new vscode.WorkspaceEdit();
    edit.createFile(resolved.uri, { ignoreIfExists: true });
    const document = await vscode.workspace.openTextDocument(resolved.uri);
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );
    edit.replace(resolved.uri, fullRange, proposal.replacement);
    const applied = await vscode.workspace.applyEdit(edit);
    if (!applied) {
      throw new Error('VS Code rejected the workspace edit.');
    }
    await document.save();
    this.proposals.delete(id);
  }
}

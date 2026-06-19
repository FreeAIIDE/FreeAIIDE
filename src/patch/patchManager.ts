import * as vscode from 'vscode';
import { resolveWorkspacePath } from '../security/workspacePath';
import { EditProposal } from './types';

const PROPOSED_SCHEME = 'freeai-proposed';
const EMPTY_SCHEME = 'freeai-empty';

export class PatchManager implements vscode.TextDocumentContentProvider, vscode.Disposable {
  private readonly proposals = new Map<string, EditProposal>();
  private readonly changeEmitter = new vscode.EventEmitter<vscode.Uri>();
  readonly onDidChange = this.changeEmitter.event;

  constructor(private readonly context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.workspace.registerTextDocumentContentProvider(PROPOSED_SCHEME, this),
      vscode.workspace.registerTextDocumentContentProvider(EMPTY_SCHEME, this)
    );
  }

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

  async showDiff(id: string): Promise<void> {
    const proposal = this.proposals.get(id);
    if (!proposal) {
      throw new Error('Unknown edit proposal.');
    }

    const resolved = resolveWorkspacePath(proposal.path, { allowMissing: true });
    const proposedUri = vscode.Uri.from({
      scheme: PROPOSED_SCHEME,
      path: `/${proposal.id}/${proposal.path}`
    });
    this.changeEmitter.fire(proposedUri);

    let originalUri = resolved.uri;
    try {
      await vscode.workspace.fs.stat(resolved.uri);
    } catch {
      originalUri = vscode.Uri.from({
        scheme: EMPTY_SCHEME,
        path: `/${proposal.id}/${proposal.path}`
      });
    }

    await vscode.commands.executeCommand(
      'vscode.diff',
      originalUri,
      proposedUri,
      `FreeAI Proposal: ${proposal.path}`
    );
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

  provideTextDocumentContent(uri: vscode.Uri): string {
    if (uri.scheme === EMPTY_SCHEME) {
      return '';
    }
    const proposalId = uri.path.split('/').filter(Boolean)[0];
    return this.proposals.get(proposalId)?.replacement ?? '';
  }

  dispose(): void {
    this.changeEmitter.dispose();
  }
}

export type WebviewToExtensionMessage =
  | { type: 'sendMessage'; text: string }
  | { type: 'approveEdit'; proposalId: string }
  | { type: 'rejectEdit'; proposalId: string };

export type ExtensionToWebviewMessage =
  | { type: 'appendUser'; text: string }
  | { type: 'startAssistant' }
  | { type: 'appendAssistant'; text: string }
  | { type: 'error'; text: string }
  | { type: 'editProposal'; proposalId: string; path: string; summary: string };

export interface WorkspaceContext {
  workspaceName: string;
  activeFilePath: string;
  languageId: string;
  selection: string;
  nearbyCode: string;
  diagnostics: string;
}

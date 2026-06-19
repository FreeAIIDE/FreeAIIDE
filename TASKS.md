# Tasks

This file is the execution checklist for building FreeAI IDE.

## Phase 0 — Scope and Architecture

- [x] Confirm MVP scope.
- [x] Confirm local-first requirement.
- [x] Confirm no web scraping or AI website automation.
- [x] Confirm VS Code extension-first approach.
- [x] Confirm future Code - OSS fork plan.

Acceptance criteria:

- [x] Architecture is documented.
- [x] Security boundaries are documented.
- [x] Development order is clear.

## Phase 1 — Extension Scaffold

- [x] Create `package.json`.
- [x] Create `tsconfig.json`.
- [x] Create `src/extension.ts`.
- [x] Add command `freeai.openChat`.
- [x] Add view contribution.
- [x] Add basic settings.
- [x] Add build scripts.

Acceptance criteria:

- [x] Extension compiles.
- [ ] Extension Development Host launches.
- [ ] Command is visible in Command Palette.

## Phase 2 — Chat Sidebar

- [x] Create `src/ui/chatViewProvider.ts`.
- [x] Create `src/ui/webviewHtml.ts`.
- [x] Create `src/ui/messageProtocol.ts`.
- [x] Implement user message rendering.
- [x] Implement assistant message rendering.
- [x] Implement streaming chunk updates.
- [ ] Add mock assistant response.

Acceptance criteria:

- [x] User can send a message.
- [ ] Mock assistant response appears.
- [x] UI is ready for streaming.

## Phase 3 — Ollama Provider

- [x] Create provider interfaces.
- [x] Implement Ollama `/api/chat` streaming.
- [x] Read base URL and model from settings.
- [x] Connect chat UI to provider.
- [x] Add clear error when Ollama is not running.

Acceptance criteria:

- [x] Ollama responses stream in chat.
- [x] Provider can be configured.
- [x] Errors are user-friendly.

## Phase 4 — Context Manager

- [x] Capture active file path.
- [x] Capture language ID.
- [x] Capture selected text.
- [x] Capture nearby code.
- [x] Capture diagnostics.
- [x] Add context truncation.
- [x] Exclude sensitive files.

Acceptance criteria:

- [x] Context is relevant and bounded.
- [x] Sensitive files are excluded.
- [x] Entire repo is not dumped.

## Phase 5 — Secure Tools

- [x] Implement workspace path resolver.
- [x] Implement sensitive file guard.
- [x] Implement exclusion guard.
- [x] Implement `list_files`.
- [x] Implement `read_file`.
- [x] Implement `search_code`.
- [x] Implement tool registry.

Acceptance criteria:

- [x] Tools return structured results.
- [x] Path traversal is blocked.
- [x] Sensitive files are blocked.
- [x] Search returns path, line, and preview.

## Phase 6 — Agent Loop

- [x] Write agent system prompt.
- [x] Implement JSON tool-call parser.
- [x] Implement agent loop.
- [x] Add max tool-call limit.
- [x] Append tool results to conversation.
- [x] Stream final answer to UI.

Acceptance criteria:

- [x] Agent can call tools.
- [x] Agent stops at tool-call limit.
- [x] Malformed tool calls are handled.

## Phase 7 — Patch Workflow

- [x] Implement `propose_edit`.
- [x] Implement patch manager.
- [ ] Show diff preview.
- [x] Ask user for confirmation.
- [x] Implement `apply_edit`.
- [x] Use WorkspaceEdit.

Acceptance criteria:

- [ ] Diff is shown before edit.
- [x] Edit applies only after approval.
- [x] User can reject edits.

## Phase 8 — OpenAI-Compatible Provider

- [x] Implement provider.
- [x] Add SecretStorage integration.
- [x] Add API key command.
- [x] Add provider selection command.
- [x] Add model setting command.
- [ ] Add cloud context warning.

Acceptance criteria:

- [x] API key is not stored in settings.
- [x] Provider works with user-owned key.
- [x] Local mode remains default.

## Phase 9 — Settings and UX

- [ ] Add all configuration entries.
- [ ] Add status indicator.
- [ ] Add provider test command.
- [ ] Improve error messages.
- [ ] Update README.

Acceptance criteria:

- [ ] User can configure provider and model.
- [ ] User can test provider.
- [ ] Setup instructions are clear.

## Phase 10 — Security Tests

- [ ] Test path traversal.
- [ ] Test sensitive file blocking.
- [ ] Test excluded directories.
- [ ] Test read_file line ranges.
- [ ] Test tool parser.
- [ ] Test context truncation.

Acceptance criteria:

- [ ] Security tests pass.
- [ ] Tool tests pass.
- [ ] Parser tests pass.

## Phase 11 — Packaging

- [x] Add `.vscodeignore`.
- [x] Add package script.
- [x] Build `.vsix`.
- [ ] Install locally.
- [ ] Verify activation.

Acceptance criteria:

- [x] `.vsix` is generated.
- [ ] Extension installs locally.
- [ ] Extension works after installation.

## Phase 12 — Inline Completion

- [ ] Implement inline completion provider.
- [ ] Add enable/disable setting.
- [ ] Add completion prompt.
- [ ] Add latency guard.

Acceptance criteria:

- [ ] Inline suggestions appear.
- [ ] Feature can be disabled.

## Phase 13 — Code - OSS Fork Plan

- [ ] Clone Code - OSS.
- [ ] Identify branding files.
- [ ] Configure product metadata.
- [ ] Bundle extension.
- [ ] Build macOS app.
- [ ] Document license boundaries.

Acceptance criteria:

- [ ] Standalone fork plan is documented.
- [ ] Product does not use official VS Code branding.

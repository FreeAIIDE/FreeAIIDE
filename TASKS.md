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
- [x] Extension Development Host launches.
- [x] Command is visible in Command Palette.

## Phase 2 — Chat Sidebar

- [x] Create `src/ui/chatViewProvider.ts`.
- [x] Create `src/ui/webviewHtml.ts`.
- [x] Create `src/ui/messageProtocol.ts`.
- [x] Implement user message rendering.
- [x] Implement assistant message rendering.
- [x] Implement streaming chunk updates.
- [x] Add mock assistant response.

Acceptance criteria:

- [x] User can send a message.
- [x] Mock assistant response appears.
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
- [x] Show diff preview.
- [x] Ask user for confirmation.
- [x] Implement `apply_edit`.
- [x] Use WorkspaceEdit.

Acceptance criteria:

- [x] Diff is shown before edit.
- [x] Edit applies only after approval.
- [x] User can reject edits.

## Phase 8 — OpenAI-Compatible Provider

- [x] Implement provider.
- [x] Add SecretStorage integration.
- [x] Add API key command.
- [x] Add provider selection command.
- [x] Add model setting command.
- [x] Add cloud context warning.

Acceptance criteria:

- [x] API key is not stored in settings.
- [x] Provider works with user-owned key.
- [x] Local mode remains default.

## Phase 9 — Settings and UX

- [x] Add all configuration entries.
- [x] Add status indicator.
- [x] Add provider test command.
- [x] Improve error messages.
- [x] Update README.

Acceptance criteria:

- [x] User can configure provider and model.
- [x] User can test provider.
- [x] Setup instructions are clear.

## Phase 10 — Security Tests

- [x] Test path traversal.
- [x] Test sensitive file blocking.
- [x] Test excluded directories.
- [x] Test read_file line ranges.
- [x] Test tool parser.
- [x] Test context truncation.

Acceptance criteria:

- [x] Security tests pass.
- [x] Tool tests pass.
- [x] Parser tests pass.

## Phase 11 — Packaging

- [x] Add `.vscodeignore`.
- [x] Add package script.
- [x] Build `.vsix`.
- [x] Install locally.
- [x] Verify activation.

Acceptance criteria:

- [x] `.vsix` is generated.
- [x] Extension installs locally.
- [x] Extension works after installation.

## Phase 12 — Inline Completion

- [x] Implement inline completion provider.
- [x] Add enable/disable setting.
- [x] Add completion prompt.
- [x] Add latency guard.

Acceptance criteria:

- [x] Inline suggestions appear.
- [x] Feature can be disabled.

## Phase 13 — Code - OSS Fork Plan

- [x] Clone Code - OSS.
- [x] Identify branding files.
- [x] Configure product metadata.
- [x] Bundle extension.
- [ ] Build macOS app.
- [x] Document license boundaries.

Acceptance criteria:

- [x] Standalone fork plan is documented.
- [x] Product does not use official VS Code branding.

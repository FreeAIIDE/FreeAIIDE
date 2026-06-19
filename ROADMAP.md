# Roadmap

## Phase 1 — Extension MVP

Priority: Critical

- VS Code extension scaffold.
- Chat sidebar.
- Ollama streaming provider.
- Active file and selection context.
- Secure workspace tools:
  - `list_files`
  - `read_file`
  - `search_code`
- JSON tool-call agent loop.
- Patch proposal.
- User-approved edit application.
- Basic settings.
- `.vsix` packaging.

## Phase 2 — BYOK Provider Support

Priority: High

- OpenAI-compatible provider.
- Base URL setting.
- Model setting.
- API key command.
- SecretStorage integration.
- Cloud context warning.
- Provider test command.

## Phase 3 — Security Hardening

Priority: High

- Path traversal tests.
- Sensitive file tests.
- Tool input validation.
- File size limits.
- Binary file detection.
- Approval gates.
- Security documentation.

## Phase 4 — Developer Experience

Priority: Medium

- Better chat UI.
- Provider status indicator.
- Better error messages.
- Command palette improvements.
- Setup wizard for Ollama.
- README improvements.

## Phase 5 — Inline Completion

Priority: Medium

- Inline completion provider.
- Small local context prompt.
- Enable/disable setting.
- Latency limits.
- Model-specific completion prompts.

## Phase 6 — Better Patch System

Priority: High

- Unified diff parser.
- Multi-file patch proposals.
- Patch sets.
- Better diff preview.
- Rollback support.
- Conflict detection.

## Phase 7 — Workspace Intelligence

Priority: Medium

- Local embeddings.
- Workspace indexing.
- Symbol-aware retrieval.
- Git-aware context.
- Test-aware context.
- Documentation-aware context.

## Phase 8 — Agent Modes

Priority: Medium

- Explain mode.
- Refactor mode.
- Test generation mode.
- Code review mode.
- Debug diagnostics mode.
- Documentation generation mode.

## Phase 9 — Safe Command Execution

Priority: Medium

- Allowlisted command runner.
- Explicit confirmation.
- Output streaming.
- Test runner integration.
- Package manager detection.
- Destructive command blocking.

## Phase 10 — Standalone IDE

Priority: Long-term

- Code - OSS fork.
- Product rebranding.
- Built-in FreeAI extension.
- Default local provider.
- macOS build.
- Extension gallery decision.
- Update strategy from upstream Code - OSS.

## Not Planned for MVP

- Web UI automation.
- Scraping AI websites.
- Hidden background agents.
- Hidden telemetry.
- Unrestricted terminal execution.
- Automatic cloud repository upload.

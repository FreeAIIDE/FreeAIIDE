# AGENTS.md — Project Instructions for AI Coding Agents

This file must be read before modifying the FreeAI IDE repository.

## Project Summary

FreeAI IDE is a local-first AI coding assistant. It starts as a VS Code extension and may later be bundled into a Code - OSS fork.

The extension must provide AI chat, controlled workspace inspection, code search, patch proposal, and user-approved edits.

## Mandatory Rules

1. Do not scrape AI websites.
2. Do not automate DeepSeek, Claude, ChatGPT, or other web UIs.
3. Do not bypass rate limits, login systems, captchas, or access controls.
4. Do not hardcode API keys.
5. Store API keys only in VS Code `SecretStorage`.
6. Default to local Ollama.
7. Cloud providers must be optional.
8. Do not read files outside the workspace.
9. Prevent path traversal.
10. Block sensitive files by default.
11. Do not apply edits without explicit user approval.
12. Do not run shell commands without explicit user approval.
13. Do not send entire repositories to cloud models.
14. Do not add telemetry unless explicitly requested.
15. Do not use Microsoft VS Code branding in a Code - OSS fork.

## Architecture

```text
UI Layer
  Chat sidebar, streaming renderer, diff approval UI

Agent Layer
  Agent loop, system prompts, tool-call parser, tool-call budget

Context Layer
  Active file, selection, nearby code, diagnostics, workspace metadata

Tool Layer
  list_files, read_file, search_code, propose_edit, apply_edit

Provider Layer
  Ollama provider, OpenAI-compatible provider, provider factory

Security Layer
  Workspace path validation, sensitive file blocking, approval gates

Configuration Layer
  VS Code settings, SecretStorage, commands
```

## Preferred Development Order

```text
1. Extension scaffold
2. Chat sidebar UI
3. Ollama streaming provider
4. Context manager
5. Secure tools
6. Agent loop
7. Patch proposal and approval
8. OpenAI-compatible BYOK provider
9. Settings and commands
10. Security hardening
11. Tests
12. Packaging
13. Inline completion
14. Code - OSS fork integration
```

## Required Tools

```text
list_files
read_file
search_code
propose_edit
apply_edit
```

## Tool Safety Rules

All tools must:

- Accept workspace-relative paths only.
- Resolve paths through a central security utility.
- Reject path traversal.
- Reject absolute paths unless explicitly and safely resolved.
- Reject sensitive files.
- Reject excluded directories.
- Enforce size limits.

## Sensitive Files

Block these by default:

```text
.env
.env.*
*.pem
*.key
id_rsa
id_ed25519
credentials.json
secrets.json
secret.*
*.p12
*.pfx
*.kdbx
```

## Excluded Directories

Exclude these by default:

```text
node_modules
.git
dist
build
out
.next
.nuxt
coverage
vendor
.cache
.turbo
.parcel-cache
```

## JSON Tool Call Protocol

Tool call:

```json
{
  "type": "tool_call",
  "tool": "read_file",
  "input": {
    "path": "src/extension.ts"
  }
}
```

Final response:

```json
{
  "type": "final",
  "content": "I inspected the relevant files and found the issue."
}
```

## Default Agent System Prompt

```text
You are FreeAI, a coding agent running inside an IDE.

Rules:
- Do not assume file contents.
- Use tools to inspect files before making claims.
- Do not request files outside the workspace.
- Do not access sensitive files.
- Keep edits minimal and targeted.
- Explain intended changes before proposing edits.
- Do not apply edits yourself. Use propose_edit and wait for user approval.
- Use search_code for symbols, functions, references, and errors.
- Use read_file before explaining or editing a file.
- Stop after the configured tool-call budget.
- Final answers must summarize inspected files, reasoning, proposed changes, and remaining tests.
```

## Definition of Done for MVP

The MVP is complete when:

- The extension compiles.
- The chat sidebar opens.
- Ollama streams responses.
- The active file and selection are included in context.
- `list_files`, `read_file`, and `search_code` work.
- Path traversal is blocked.
- Sensitive files are blocked.
- The agent loop can call tools.
- Proposed edits show a diff.
- Edits apply only after user approval.
- The extension can be packaged as `.vsix`.

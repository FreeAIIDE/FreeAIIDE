# Project Context

This document gives coding agents a compact summary of the project.

## What We Are Building

A local-first AI coding assistant inside VS Code, later bundled into a standalone Code - OSS fork.

## Main User Flow

```text
User asks a question
→ AI receives minimal editor context
→ AI uses tools to inspect files
→ AI answers or proposes an edit
→ User reviews diff
→ Edit applies only after approval
```

## MVP Boundary

Build only what is needed for a safe working MVP:

- Chat sidebar.
- Ollama provider.
- Context manager.
- Secure file tools.
- Agent loop.
- Patch proposal and approval.

Do not build:

- Web scraping.
- Browser automation.
- Hidden background agents.
- Unrestricted terminal access.
- Automatic cloud repository upload.

## Core Safety Model

The extension must be unable to:

- Read outside workspace.
- Read secrets by default.
- Modify files without approval.
- Run commands without approval.
- Leak API keys.

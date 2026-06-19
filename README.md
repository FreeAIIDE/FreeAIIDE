# FreeAI IDE

FreeAI IDE is a local-first AI coding assistant for VS Code / Code - OSS.

The project starts as a VS Code extension and is designed to later become a standalone IDE by being bundled into a custom Code - OSS fork.

## Goals

- Provide an AI chat sidebar inside the IDE.
- Use local models through Ollama by default.
- Support optional Bring-Your-Own-Key OpenAI-compatible providers.
- Let the agent inspect workspace files through controlled tools.
- Let the agent search code safely.
- Let the agent propose code edits.
- Require user approval before applying edits.
- Prevent reading files outside the workspace.
- Protect sensitive files such as `.env`, private keys, and credentials.

## Non-Goals

- No web scraping.
- No automation of DeepSeek, Claude, ChatGPT, or other AI web UIs.
- No bypassing API limits, login systems, captchas, or access controls.
- No hidden telemetry.
- No automatic whole-repository upload to cloud models.
- No silent file edits.
- No silent terminal commands.

## Default Provider

The default provider is local Ollama.

```bash
brew install ollama
ollama serve
ollama pull qwen2.5-coder:7b
```

Alternative model:

```bash
ollama pull deepseek-coder:6.7b
```

Default endpoint:

```text
http://localhost:11434
```

## Planned Features

- Chat sidebar.
- Streaming responses.
- Workspace context manager.
- Secure tools:
  - `list_files`
  - `read_file`
  - `search_code`
  - `propose_edit`
  - `apply_edit`
- Agent loop with JSON tool-call fallback.
- User-approved patch workflow.
- Optional OpenAI-compatible provider.
- Inline completion.
- `.vsix` packaging.
- Future Code - OSS fork integration.

## Development Setup

Install dependencies:

```bash
npm install
```

Compile:

```bash
npm run compile
```

Watch mode:

```bash
npm run watch
```

Run tests:

```bash
npm run test
```

Package extension:

```bash
npm run package
```

## Security Model

FreeAI IDE is designed around workspace-bound access.

The extension must never read files outside the current workspace. It must block sensitive files by default and require explicit user approval before applying edits or running commands.

See [`SECURITY.md`](./SECURITY.md) and [`PRIVACY.md`](./PRIVACY.md).

## Project Instructions for AI Agents

AI coding agents must read [`AGENTS.md`](./AGENTS.md) before modifying this repository.

## License

MIT. See [`LICENSE`](./LICENSE).

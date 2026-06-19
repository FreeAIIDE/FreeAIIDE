# Contributing

## Development Principles

FreeAI IDE prioritizes:

- Security.
- Local-first behavior.
- User control.
- Minimal context sharing.
- Clear approval gates.
- Maintainable TypeScript.

## Setup

```bash
npm install
npm run compile
```

Run in watch mode:

```bash
npm run watch
```

Launch Extension Development Host from VS Code.

## Before Making Changes

Read:

- `AGENTS.md`
- `SECURITY.md`
- `ARCHITECTURE.md`
- `TASKS.md`

## Pull Request Rules

Every PR should include:

- Clear description.
- Security impact.
- Privacy impact.
- Tests for changed behavior.
- Documentation updates when needed.

## Security-Sensitive Changes

The following require extra review:

- File access tools.
- Path resolution.
- Patch application.
- Command execution.
- Provider implementation.
- Secret handling.
- Cloud context behavior.

## Code Style

Use:

- TypeScript.
- Explicit interfaces.
- Small modules.
- Clear error handling.
- Structured tool results.

Avoid:

- Hidden global state.
- Broad `any`.
- Direct path concatenation.
- Silent failures.
- Hardcoded secrets.

## Testing

Run:

```bash
npm run test
```

Security tests must pass before release.

## Commit Style

Recommended format:

```text
type(scope): short description
```

Examples:

```text
feat(agent): add JSON tool-call parser
fix(security): block path traversal in read_file
docs(readme): add Ollama setup
test(tools): cover sensitive file blocking
```

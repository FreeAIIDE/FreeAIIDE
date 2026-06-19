# Security Policy

## Security Philosophy

FreeAI IDE must be local-first, workspace-bound, and user-approved.

The extension is allowed to help with code, but it must not silently access sensitive files, send excessive context to cloud services, or modify files without permission.

## Supported Security Boundaries

The extension must enforce:

- Workspace-only file access.
- Path traversal prevention.
- Sensitive file blocking.
- Explicit approval before edits.
- Explicit approval before commands.
- SecretStorage-only API key handling.
- No default telemetry.
- Local Ollama as default provider.

## File Access Rules

Tools may read files only when all conditions are true:

1. A workspace is open.
2. The requested path is workspace-relative.
3. The resolved path remains inside a workspace folder.
4. The path does not traverse outside the workspace.
5. The file is not sensitive.
6. The file is not inside an excluded directory.
7. The file size is below the configured limit.
8. The file is not binary.

Blocked examples:

```text
../package.json
../../.ssh/id_rsa
/Users/alex/.env
C:\Users\alex\.ssh\id_rsa
src/../../.env
```

## Sensitive Files

Block these patterns by default:

```text
.env
.env.local
.env.production
.env.development
*.pem
*.key
*.p12
*.pfx
id_rsa
id_ed25519
credentials.json
secrets.json
secret.*
*.kdbx
```

## Excluded Directories

Exclude these directories by default:

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

## API Keys

API keys must never be stored in:

- `settings.json`
- `.env`
- source code
- logs
- normal extension configuration

API keys must be stored only in:

```text
VS Code SecretStorage
```

## Cloud Provider Warning

Before sending workspace context to a cloud provider, the extension must warn the user that selected code, diagnostics, file paths, or tool results may be sent to the configured external API endpoint.

The default provider must remain local Ollama.

## Edit Approval

The extension must not apply edits silently.

The required workflow is:

```text
Agent proposes edit
→ Extension shows diff
→ User accepts or rejects
→ WorkspaceEdit applies only if accepted
```

## Command Execution

Do not implement unrestricted command execution in the MVP.

If command execution is added later:

- Show the exact command.
- Explain why it is needed.
- Require explicit confirmation.
- Prefer allowlisted commands.
- Never run destructive commands silently.

## Reporting Vulnerabilities

Open a private issue or contact the maintainers directly.

Do not publish exploit details before a fix is available.

## Security Checklist

Before release, verify:

- [ ] Path traversal is blocked.
- [ ] Sensitive files are blocked.
- [ ] API keys use SecretStorage.
- [ ] Edits require confirmation.
- [ ] Commands require confirmation or are not implemented.
- [ ] Cloud provider warning exists.
- [ ] No telemetry is enabled by default.
- [ ] Tests cover security behavior.

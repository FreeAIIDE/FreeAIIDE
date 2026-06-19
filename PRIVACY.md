# Privacy Policy

## Summary

FreeAI IDE is designed to be local-first.

By default, AI requests should go to a local Ollama server running on the user's machine.

No workspace content should be sent to a cloud provider unless the user explicitly configures a cloud provider and sends a request using that provider.

## Local Provider

Default provider:

```text
Ollama
http://localhost:11434
```

When using Ollama, requests are sent to the local machine.

## Cloud Providers

If the user configures an OpenAI-compatible provider, the following may be sent to the configured endpoint:

- User message.
- Selected text.
- Active file context.
- Diagnostics.
- Tool results.
- File paths relative to the workspace.
- Code snippets explicitly included in context.

The extension must warn the user before sending workspace context to a cloud provider.

## API Keys

API keys must be stored only in VS Code SecretStorage.

API keys must not be stored in:

- source files
- `settings.json`
- `.env`
- logs
- telemetry
- crash reports

## Telemetry

Telemetry must be disabled by default or omitted entirely.

No analytics should be collected in the MVP.

## Sensitive Files

The extension must block sensitive files by default, including:

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
```

## User Control

The user must approve:

- File edits.
- Command execution.
- Cloud provider configuration.
- Sending context to a cloud provider, where applicable.

## Data Retention

The extension should not keep long-term copies of user code unless the user explicitly enables a feature that requires it.

Future indexing or memory features must be local-first by default.

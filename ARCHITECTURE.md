# Architecture

## Overview

FreeAI IDE is built as a VS Code extension first. The extension is later intended to be bundled into a Code - OSS fork.

The system is divided into independent layers:

```text
User
  ↓
Chat Sidebar UI
  ↓
Agent Loop
  ↓
Context Manager
  ↓
Tool Registry
  ↓
Secure Workspace Tools
  ↓
Model Provider
  ↓
Ollama or OpenAI-Compatible API
```

## Layer Responsibilities

### UI Layer

Responsible for:

- Chat sidebar.
- Message rendering.
- Streaming response updates.
- User input.
- Diff approval UI.
- Provider status display.

Files:

```text
src/ui/chatViewProvider.ts
src/ui/webviewHtml.ts
src/ui/messageProtocol.ts
src/ui/status.ts
```

### Provider Layer

Responsible for model access.

Providers:

- Ollama provider.
- OpenAI-compatible provider.
- Provider factory.

Files:

```text
src/providers/types.ts
src/providers/ollamaProvider.ts
src/providers/openAICompatibleProvider.ts
src/providers/providerFactory.ts
```

### Agent Layer

Responsible for reasoning loop orchestration.

It must:

- Build initial messages.
- Include context.
- Parse JSON tool calls.
- Execute tools.
- Append tool results.
- Stop after max tool calls.
- Stream final answers.

Files:

```text
src/agent/prompts.ts
src/agent/agentLoop.ts
src/agent/toolCallParser.ts
src/agent/types.ts
```

### Context Layer

Responsible for safe context construction.

Context may include:

- Active file path.
- Active language ID.
- Selection.
- Nearby code.
- Diagnostics.
- Workspace name.
- Tool results.

It must not dump the entire repository into the model.

Files:

```text
src/context/contextManager.ts
src/context/truncate.ts
src/context/types.ts
```

### Tool Layer

Responsible for controlled workspace access.

Initial tools:

```text
list_files
read_file
search_code
propose_edit
apply_edit
```

Files:

```text
src/tools/toolRegistry.ts
src/tools/listFiles.ts
src/tools/readFile.ts
src/tools/searchCode.ts
src/tools/proposeEdit.ts
src/tools/applyEdit.ts
```

### Patch Layer

Responsible for edit proposals and user approval.

Files:

```text
src/patch/patchManager.ts
src/patch/types.ts
```

### Security Layer

Responsible for shared validation and guards.

Files:

```text
src/security/workspacePath.ts
src/security/sensitiveFiles.ts
src/security/exclusions.ts
src/security/fileGuards.ts
src/security/audit.ts
```

### Configuration Layer

Responsible for settings and secrets.

Files:

```text
src/config/settings.ts
src/config/secrets.ts
src/commands/configCommands.ts
```

## Data Flow

### Chat Request Flow

```text
User submits message
→ ChatViewProvider sends message to AgentLoop
→ ContextManager builds initial context
→ Provider streams model response
→ AgentLoop detects tool calls
→ ToolRegistry runs safe tools
→ Tool result is appended to model conversation
→ Final answer streams to UI
```

### Edit Flow

```text
User asks for code change
→ Agent inspects files through tools
→ Agent calls propose_edit
→ PatchManager creates diff preview
→ User reviews diff
→ User accepts or rejects
→ apply_edit uses WorkspaceEdit only after approval
```

## Provider Strategy

Default provider:

```text
ollama
```

Optional provider:

```text
openai-compatible
```

Provider configuration must be read from VS Code settings. API keys must be read from SecretStorage.

## Future Code - OSS Fork

After the extension is stable:

1. Fork Code - OSS.
2. Rebrand the product.
3. Remove Microsoft-specific branding.
4. Bundle this extension as built-in.
5. Keep Ollama as default.
6. Review extension gallery settings.
7. Build macOS packages.
8. Document licensing boundaries.

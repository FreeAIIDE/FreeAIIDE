import * as vscode from 'vscode';

export function getWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const nonce = getNonce();
  const cspSource = webview.cspSource;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource} https:; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <style nonce="${nonce}">
    body { margin: 0; font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-sideBar-background); }
    .wrap { height: 100vh; display: grid; grid-template-rows: 1fr auto; }
    #messages { overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
    .msg { white-space: pre-wrap; border: 1px solid var(--vscode-panel-border); border-radius: 6px; padding: 8px; line-height: 1.4; }
    .user { background: var(--vscode-input-background); }
    .assistant { background: var(--vscode-editor-background); }
    .error { border-color: var(--vscode-errorForeground); color: var(--vscode-errorForeground); }
    form { display: grid; grid-template-columns: 1fr auto; gap: 8px; padding: 10px; border-top: 1px solid var(--vscode-panel-border); }
    textarea { resize: none; min-height: 44px; color: var(--vscode-input-foreground); background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border); padding: 8px; font-family: inherit; }
    button { color: var(--vscode-button-foreground); background: var(--vscode-button-background); border: 0; padding: 0 12px; border-radius: 4px; cursor: pointer; }
    .proposal { display: grid; gap: 8px; }
    .actions { display: flex; gap: 8px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div id="messages"></div>
    <form id="form">
      <textarea id="input" placeholder="Ask FreeAI"></textarea>
      <button type="submit">Send</button>
    </form>
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const messages = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    let currentAssistant;

    function addMessage(text, className) {
      const el = document.createElement('div');
      el.className = 'msg ' + className;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      vscode.postMessage({ type: 'sendMessage', text });
    });

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'appendUser') addMessage(message.text, 'user');
      if (message.type === 'startAssistant') currentAssistant = addMessage('', 'assistant');
      if (message.type === 'appendAssistant') currentAssistant.textContent += message.text;
      if (message.type === 'error') addMessage(message.text, 'error');
      if (message.type === 'editProposal') {
        const el = addMessage('', 'assistant proposal');
        el.textContent = message.summary + '\\n' + message.path + '\\nProposal ID: ' + message.proposalId;
        const actions = document.createElement('div');
        actions.className = 'actions';
        const approve = document.createElement('button');
        approve.textContent = 'Approve';
        approve.addEventListener('click', () => vscode.postMessage({ type: 'approveEdit', proposalId: message.proposalId }));
        const reject = document.createElement('button');
        reject.textContent = 'Reject';
        reject.addEventListener('click', () => vscode.postMessage({ type: 'rejectEdit', proposalId: message.proposalId }));
        actions.append(approve, reject);
        el.appendChild(actions);
      }
    });
  </script>
</body>
</html>`;
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let value = '';
  for (let i = 0; i < 32; i += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

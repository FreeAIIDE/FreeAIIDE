import * as assert from 'assert';
import { parseAgentResponse } from '../agent/toolCallParser';
import { truncateMiddle } from '../context/truncate';
import { isExcludedPath } from '../security/exclusions';
import { isSensitivePath } from '../security/sensitiveFiles';
import { normalizeWorkspaceRelativePath } from '../security/pathValidation';
import { sliceLineRange } from '../tools/lineRange';

function testToolParser(): void {
  assert.deepStrictEqual(parseAgentResponse('{"type":"tool_call","tool":"read_file","input":{"path":"src/extension.ts"}}'), {
    type: 'tool_call',
    tool: 'read_file',
    input: { path: 'src/extension.ts' }
  });
  assert.deepStrictEqual(parseAgentResponse('```json\n{"type":"final","content":"done"}\n```'), {
    type: 'final',
    content: 'done'
  });
  assert.deepStrictEqual(parseAgentResponse('plain text'), {
    type: 'text',
    content: 'plain text'
  });
}

function testSensitiveFiles(): void {
  assert.strictEqual(isSensitivePath('.env'), true);
  assert.strictEqual(isSensitivePath('app/.env.production'), true);
  assert.strictEqual(isSensitivePath('keys/private.pem'), true);
  assert.strictEqual(isSensitivePath('credentials.json'), true);
  assert.strictEqual(isSensitivePath('src/index.ts'), false);
}

function testExcludedDirectories(): void {
  assert.strictEqual(isExcludedPath('node_modules/pkg/index.js'), true);
  assert.strictEqual(isExcludedPath('src/.git/config'), true);
  assert.strictEqual(isExcludedPath('coverage/report.html'), true);
  assert.strictEqual(isExcludedPath('src/extension.ts'), false);
}

function testContextTruncation(): void {
  const short = 'hello';
  assert.strictEqual(truncateMiddle(short, 20), short);
  const long = 'a'.repeat(100);
  const truncated = truncateMiddle(long, 40);
  assert.ok(truncated.includes('[truncated]'));
  assert.ok(truncated.length <= 60);
}

function testPathTraversal(): void {
  assert.strictEqual(normalizeWorkspaceRelativePath('src/extension.ts'), 'src/extension.ts');
  assert.throws(() => normalizeWorkspaceRelativePath('../package.json'), /traversal/);
  assert.throws(() => normalizeWorkspaceRelativePath('/tmp/package.json'), /workspace-relative/);
  assert.throws(() => normalizeWorkspaceRelativePath('src/../../.env'), /traversal/);
}

function testReadFileLineRanges(): void {
  assert.deepStrictEqual(sliceLineRange('a\nb\nc\nd', 2, 3), {
    startLine: 2,
    endLine: 3,
    content: 'b\nc'
  });
  assert.deepStrictEqual(sliceLineRange('a\nb', -10, 20), {
    startLine: 1,
    endLine: 2,
    content: 'a\nb'
  });
}

testToolParser();
testSensitiveFiles();
testExcludedDirectories();
testContextTruncation();
testPathTraversal();
testReadFileLineRanges();

console.log('FreeAI tests passed');

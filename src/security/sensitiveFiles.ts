import * as path from 'path';

const exactNames = new Set([
  '.env',
  'id_rsa',
  'id_ed25519',
  'credentials.json',
  'secrets.json'
]);

const suffixes = ['.pem', '.key', '.p12', '.pfx', '.kdbx'];

export function isSensitivePath(workspaceRelativePath: string): boolean {
  const baseName = path.posix.basename(toPosix(workspaceRelativePath));
  return (
    exactNames.has(baseName) ||
    baseName.startsWith('.env.') ||
    baseName.startsWith('secret.') ||
    suffixes.some((suffix) => baseName.endsWith(suffix))
  );
}

export function toPosix(value: string): string {
  return value.replace(/\\/g, '/');
}

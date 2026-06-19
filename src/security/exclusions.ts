import { toPosix } from './sensitiveFiles';

const excludedSegments = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  'coverage',
  'vendor',
  '.cache',
  '.turbo',
  '.parcel-cache'
]);

export function isExcludedPath(workspaceRelativePath: string): boolean {
  return toPosix(workspaceRelativePath)
    .split('/')
    .filter(Boolean)
    .some((segment) => excludedSegments.has(segment));
}

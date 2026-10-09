import fs from 'node:fs';
import path from 'node:path';

function resolveWithin(baseDir: string, targetPath: string): string {
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(targetPath);

  if (resolvedTarget !== resolvedBase && !resolvedTarget.startsWith(resolvedBase + path.sep)) {
    throw new Error(`Refusing to access path outside of ${resolvedBase}: ${resolvedTarget}`);
  }

  return resolvedTarget;
}

export function readFileWithin(baseDir: string, targetPath: string, encoding: BufferEncoding = 'utf-8'): string {
  return fs.readFileSync(resolveWithin(baseDir, targetPath), encoding);
}

export function writeFileWithin(baseDir: string, targetPath: string, data: string, encoding: BufferEncoding = 'utf-8'): void {
  fs.writeFileSync(resolveWithin(baseDir, targetPath), data, encoding);
}

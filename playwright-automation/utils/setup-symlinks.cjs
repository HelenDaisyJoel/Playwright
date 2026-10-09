#!/usr/bin/env node
/* eslint-disable no-console */
// Recreates .claude/ symlinks after npm install.
// Symlinks point into the SDK package so agents always read the latest
// schemas, conventions and skills bundled with the installed SDK version.

const fs   = require('fs');
const path = require('path');

const SDK_PACKAGE = '@norwegian-cruise-line/ai-playwright-sdk';
const SDK_CLAUDE  = path.join('node_modules', SDK_PACKAGE, '.claude');
const CLAUDE_DIR  = '.claude';

const LINKS = [
  'agents',
  'skills',
  'env-schema.md',
  'gherkin-conventions.md',
  'openspec-schema.md',
  'domain-capability-schema.md',
];

if (!fs.existsSync(SDK_CLAUDE)) {
  console.warn(`[setup-symlinks] SDK not found at ${SDK_CLAUDE} — skipping symlink setup.`);
  process.exit(0);
}

fs.mkdirSync(CLAUDE_DIR, { recursive: true });

for (const name of LINKS) {
  const linkPath = path.join(CLAUDE_DIR, name);
  const target   = path.join('..', SDK_CLAUDE, name);

  try {
    if (fs.existsSync(linkPath) || fs.lstatSync(linkPath).isSymbolicLink()) {
      fs.unlinkSync(linkPath);
    }
  } catch {
    // link didn't exist — that's fine
  }

  fs.symlinkSync(target, linkPath);
  console.log(`[setup-symlinks] ${linkPath} → ${target}`);
}

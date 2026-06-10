import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function readFile(filePath: string): string {
  return fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf-8');
}

function stripJsonComments(json: string): string {
  return json.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function getAllTsFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      results.push(...getAllTsFiles(full));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

describe('Code Quality — Structural Checks', () => {
  it('tsconfig.json has strict mode enabled', () => {
    const tsconfig = JSON.parse(stripJsonComments(readFile('tsconfig.json')));
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('tsconfig.json disallows unused locals', () => {
    const tsconfig = JSON.parse(stripJsonComments(readFile('tsconfig.json')));
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
  });

  it('tsconfig.json disallows unused parameters', () => {
    const tsconfig = JSON.parse(stripJsonComments(readFile('tsconfig.json')));
    expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
  });

  it('no dangerouslySetInnerHTML usage in source', () => {
    const srcDir = path.resolve(__dirname, '../src');
    const files = getAllTsFiles(srcDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toContain('dangerouslySetInnerHTML');
    }
  });

  it('no hardcoded localhost URLs in source', () => {
    const srcDir = path.resolve(__dirname, '../src');
    const files = getAllTsFiles(srcDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/https?:\/\/localhost/);
    }
  });

  it('.gitignore excludes .env files', () => {
    const gitignore = readFile('.gitignore');
    expect(gitignore).toContain('.env');
  });

  it('package.json has build and test scripts', () => {
    const pkg = JSON.parse(readFile('package.json'));
    expect(pkg.scripts.build).toBeDefined();
    expect(pkg.scripts.test).toBeDefined();
  });

  it('package.json uses exact or caret versioning (no wildcards)', () => {
    const pkg = JSON.parse(readFile('package.json'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [, version] of Object.entries(allDeps)) {
      expect(version).not.toContain('*');
      expect(version).not.toContain('latest');
    }
  });

  it('all service files export named functions (no default class exports)', () => {
    const servicesDir = path.resolve(__dirname, '../src/services');
    const files = getAllTsFiles(servicesDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/export default class/);
    }
  });
});

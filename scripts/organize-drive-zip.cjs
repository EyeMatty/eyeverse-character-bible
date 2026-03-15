#!/usr/bin/env node
/**
 * Organize a Google Drive download zip into source-assets/characters/
 *
 * Usage:
 *   node scripts/organize-drive-zip.cjs [path/to/zip]
 *
 * Default zip path: ./character-art.zip (in project root)
 *
 * 1. Put your Drive folder zip in the project (e.g. character-art.zip).
 * 2. Run: npm run setup:drive-zip
 * 3. Run: npm run process:characters
 */

const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_CHARACTERS = path.join(ROOT, "source-assets", "characters");
const TMP_EXTRACT = path.join(ROOT, ".tmp-drive-extract");

const SKIP_NAMES = new Set([
  "paradox 1_1s.pptx",
  "paradox 1_1s",
  ".ds_store",
]);

function getZipPath() {
  const arg = process.argv[2];
  if (arg) {
    const resolved = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
    if (fs.existsSync(resolved)) return resolved;
    console.error("Zip file not found:", resolved);
    process.exit(1);
  }
  const defaultPath = path.join(ROOT, "character-art.zip");
  if (fs.existsSync(defaultPath)) return defaultPath;
  console.error("No zip file found. Either:");
  console.error('  1. Put the Drive download zip in the project root as character-art.zip');
  console.error("  2. Or run: npm run setup:drive-zip -- path/to/your.zip");
  process.exit(1);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  const zipPath = getZipPath();
  console.log("Eyeverse — Organize Drive zip\n");
  console.log("Zip:", zipPath);
  console.log("Target:", SOURCE_CHARACTERS);
  console.log("");

  ensureDir(SOURCE_CHARACTERS);

  if (fs.existsSync(TMP_EXTRACT)) {
    fs.rmSync(TMP_EXTRACT, { recursive: true });
  }
  fs.mkdirSync(TMP_EXTRACT, { recursive: true });

  try {
    await extract(zipPath, { dir: TMP_EXTRACT });
  } catch (err) {
    console.error("Extract error:", err.message);
    if (fs.existsSync(TMP_EXTRACT)) fs.rmSync(TMP_EXTRACT, { recursive: true });
    process.exit(1);
  }

  const topLevel = fs.readdirSync(TMP_EXTRACT);
  let sourceRoot = TMP_EXTRACT;
  if (topLevel.length === 1) {
    const first = path.join(TMP_EXTRACT, topLevel[0]);
    if (fs.statSync(first).isDirectory()) {
      sourceRoot = first;
    }
  }

  const entries = fs.readdirSync(sourceRoot);
  let copied = 0;
  for (const name of entries) {
    const lower = name.toLowerCase();
    if (SKIP_NAMES.has(lower)) continue;
    const srcPath = path.join(sourceRoot, name);
    const stat = fs.statSync(srcPath);
    if (!stat.isDirectory()) continue;
    const destPath = path.join(SOURCE_CHARACTERS, name);
    copyDirRecursive(srcPath, destPath);
    copied++;
    console.log("  Copied:", name, "->", path.relative(ROOT, destPath));
  }

  fs.rmSync(TMP_EXTRACT, { recursive: true });
  console.log("\nDone. Copied", copied, "character folder(s) to source-assets/characters/");
  console.log("Next: npm run process:characters");
}

main();

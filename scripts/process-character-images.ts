/**
 * Eyeverse Character Bible — Image processing script
 *
 * Scans /source-assets/characters/, resizes each image to 1000x1000 square
 * (contain, centered, padded), exports as webp to /public/characters/[slug]/.
 *
 * Run: npm run process:characters
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const SOURCE_DIR = path.join(process.cwd(), "source-assets", "characters");
const OUTPUT_DIR = path.join(process.cwd(), "public", "characters");
const SIZE = 1000;
const EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

/** Map Google Drive / variant folder names to our character slugs. */
const FOLDER_TO_SLUG: Record<string, string> = {
  "EyeKing": "king",
  "Emerald Barks": "emerald-barks",
  "Eye Prince": "eye-prince",
  "Golem King": "golem-king",
  "Valmor Veinborn": "valmor",
  "Vokr Brokenblood": "vokr",
  "Drexel Everpresent": "drexel",
  "Juf Veinborn": "juf",
  "Agod Blutfin": "agod",
  "Batul Redskin": "batul",
  "Blut": "blut-blutfin",
  "Jax Youngblood": "jax",
  "Kors Skydeath": "kors",
};

function folderNameToSlug(folderName: string): string {
  const mapped = FOLDER_TO_SLUG[folderName];
  if (mapped) return mapped;
  return folderName.toLowerCase().replace(/\s+/g, "-");
}

function isImageFile(name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  return EXTENSIONS.has(ext);
}

function getImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(isImageFile);
}

async function processImage(
  inputPath: string,
  outputPath: string,
  isGif: boolean
): Promise<void> {
  const pipeline = sharp(inputPath).resize(SIZE, SIZE, {
    fit: "contain",
    position: "center",
    background: { r: 18, g: 18, b: 20, alpha: 1 },
  });
  if (isGif) {
    await pipeline.gif().toFile(outputPath);
  } else {
    await pipeline.webp({ quality: 90 }).toFile(outputPath);
  }
}

async function main(): Promise<void> {
  console.log("Eyeverse Character Bible — Image processor\n");
  console.log("Source:", SOURCE_DIR);
  console.log("Output:", OUTPUT_DIR);
  console.log("Canvas:", `${SIZE}x${SIZE} square, contain, centered\n`);

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error("Source directory not found. Create it and add character folders:");
    console.error("  /source-assets/characters/[character-slug]/");
    process.exit(1);
  }

  const folders = fs.readdirSync(SOURCE_DIR, { withFileTypes: true });
  const characterDirs = folders.filter((d) => d.isDirectory());

  if (characterDirs.length === 0) {
    console.log("No character folders found in source-assets/characters/.");
    console.log("Add folders named by slug (e.g. gabrer, malice) with images inside.");
    process.exit(0);
  }

  let totalProcessed = 0;
  const manifest: Record<string, string[]> = {};

  for (const dir of characterDirs) {
    const folderName = dir.name;
    const slug = folderNameToSlug(folderName);
    const sourcePath = path.join(SOURCE_DIR, folderName);
    const imageFiles = getImageFiles(sourcePath);

    if (imageFiles.length === 0) {
      console.log(`  [${folderName}] → [${slug}] — no images, skipping`);
      continue;
    }

    const outPath = path.join(OUTPUT_DIR, slug);
    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath, { recursive: true });
    }

    const existingFiles = fs.existsSync(outPath)
      ? fs.readdirSync(outPath).filter((f) => /^\d+\.(webp|gif)$/i.test(f))
      : [];
    const maxNum = existingFiles.reduce((max, f) => {
      const n = parseInt(path.basename(f), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    const startIndex = maxNum + 1;

    const sorted = imageFiles.sort((a, b) => a.localeCompare(b));
    const outputPaths: string[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const file = sorted[i];
      const num = String(startIndex + i).padStart(2, "0");
      const isGif = path.extname(file).toLowerCase() === ".gif";
      const outFile = isGif ? `${num}.gif` : `${num}.webp`;
      const inputFull = path.join(sourcePath, file);
      const outputFull = path.join(outPath, outFile);

      try {
        await processImage(inputFull, outputFull, isGif);
        outputPaths.push(`/characters/${slug}/${outFile}`);
        totalProcessed++;
        console.log(`  [${folderName}] ${file} → ${slug}/${outFile}`);
      } catch (err) {
        console.error(`  [${folderName}] ERROR ${file}:`, err);
      }
    }

    if (outputPaths.length > 0) {
      manifest[slug] = (manifest[slug] || []).concat(outputPaths);
      console.log(`  [${folderName}] → [${slug}] ${outputPaths.length} image(s). Paths:`, outputPaths);
    }
  }

  // Rebuild manifest from actual output dirs so each slug has the full sorted list
  const finalManifest: Record<string, string[]> = {};
  for (const slug of Object.keys(manifest)) {
    const dir = path.join(OUTPUT_DIR, slug);
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f) => /^\d+\.(webp|gif)$/i.test(f))
      .sort((a, b) => {
        const na = parseInt(path.basename(a, path.extname(a)), 10);
        const nb = parseInt(path.basename(b, path.extname(b)), 10);
        return na - nb;
      });
    finalManifest[slug] = files.map((f) => `/characters/${slug}/${f}`);
  }

  const manifestPath = path.join(process.cwd(), "data", "character-images.json");
  fs.writeFileSync(manifestPath, JSON.stringify(finalManifest, null, 2), "utf-8");
  console.log("\nTotal images processed:", totalProcessed);
  console.log("Manifest written to data/character-images.json — slideshows will use these paths.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

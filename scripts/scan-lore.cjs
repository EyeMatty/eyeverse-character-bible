#!/usr/bin/env node
/**
 * Scan LORE folder (docx + pdf), find character names not in data/characters,
 * write new records to data/lore-characters.json.
 *
 * Run: node scripts/scan-lore.cjs
 */

const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

const ROOT = path.resolve(__dirname, "..");
const LORE_DIR = path.join(ROOT, "LORE");
const LORE_CHARACTERS_PATH = path.join(ROOT, "data", "lore-characters.json");

const EXISTING_NAMES = new Set([
  "Aern", "Batul", "Blazen", "Chron", "Drexel", "Ekihaas", "Emerald Barks",
  "Exemplar", "Eye Prince", "EyeKing", "King", "Gabrer", "Gegssend", "Golem",
  "Golem King", "Jein", "Liten", "Malice", "Qalra", "Scavenger", "Sonskog",
  "Umog", "Valmor", "Zina",
]);

const SKIP_WORDS = new Set([
  "The", "And", "For", "With", "From", "Into", "Which", "That", "This",
  "Blood", "Vagabond", "Paradox", "Kingdom", "Season", "Shards", "Manifesto",
  "Chapters", "Story", "Stories", "Draft", "Proofed", "Eyeverse", "Realm",
  "He", "She", "It", "They", "As", "In", "To", "His", "Her", "Their", "You",
  "We", "But", "When", "Where", "What", "Who", "How", "Yes", "Let", "Well",
  "Through", "Now", "My", "While", "Each", "Of", "One", "These", "Our", "Back",
  "Queen", "Lord", "King", "Red", "White", "Black", "Ice", "Light", "Fire",
  "Water", "Land", "Deadly", "Glacier", "Spire", "Heaven", "Bloom", "Flame",
  "Chapter", "Prince", "Princess", "Lords", "Kings", "Eyes", "Eye", "Riders",
  "Vagabonds", "Elders", "Demons", "Guardian", "Guardians", "Army", "Born",
  "Cold", "Along", "Unlike", "Like", "Someone", "Take", "Speak", "Have", "May",
  "Spring", "New", "Will", "Are", "Than", "Might", "All", "Is", "Call", "Or",
  "Without", "Be", "Glory", "Silence", "Good", "Again", "Stop", "Then", "Not",
  "Can", "First", "Right", "By", "Beyond", "Tell", "Go", "Did", "Do", "Come",
  "Just", "Would", "Still", "Only", "Even", "During", "Before", "Inside", "Never",
  "Once", "Despite", "Perhaps", "However", "Finally", "Instead", "Indeed",
  "Although", "Welcome", "Sire", "Mother", "Father", "Child", "Dad", "Your",
  "Grace", "Redlume", "Pale", "Golden", "Broken", "Vein", "Deity", "Round",
  "Table", "Sanctuary", "History", "Prophecy", "Written", "Words", "Hush",
  "Aye", "Oh", "Ha", "Bred", "Watched", "Till", "Under", "On", "At", "So",
  "Some", "Together", "Yet", "There", "Between", "Behind", "Why", "Bicorn",
  "Racing", "Races", "League", "Festival", "Twin", "Horns", "Renegades",
]);

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function extractTitleCaseNames(text) {
  const seen = new Map();
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 2 || t.length > 50) continue;
    const words = t.split(/\s+/);
    if (words.length < 1 || words.length > 4) continue;
    const allTitleCase = words.every(
      (w) => w.length > 0 && w[0] === w[0].toUpperCase() && /^[A-Za-z'-]+$/.test(w)
    );
    if (!allTitleCase) continue;
    if (words.some((w) => SKIP_WORDS.has(w))) continue;
    const name = words.join(" ");
    if (EXISTING_NAMES.has(name)) continue;
    seen.set(name, (seen.get(name) || 0) + 1);
  }
  const regex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z']+){0,3})\b/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const name = m[1].trim();
    if (name.length < 2 || name.length > 40) continue;
    if (SKIP_WORDS.has(name.split(/\s+/)[0])) continue;
    if (EXISTING_NAMES.has(name)) continue;
    seen.set(name, (seen.get(name) || 0) + 1);
  }
  return seen;
}

async function extractDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  } catch (e) {
    console.warn("  Skip (docx):", path.basename(filePath), e.message);
    return "";
  }
}

async function extractPdf(filePath) {
  try {
    const pdfParse = require("pdf-parse");
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || "";
  } catch (e) {
    console.warn("  Skip (pdf):", path.basename(filePath), e.message);
    return "";
  }
}

async function main() {
  console.log("Eyeverse — Scan LORE for characters\n");
  if (!fs.existsSync(LORE_DIR)) {
    console.error("LORE folder not found.");
    process.exit(1);
  }

  const files = fs.readdirSync(LORE_DIR);
  let allText = "";
  for (const file of files) {
    const fullPath = path.join(LORE_DIR, file);
    if (!fs.statSync(fullPath).isFile()) continue;
    const ext = path.extname(fullPath).toLowerCase();
    if (ext === ".docx") {
      console.log("  Reading:", file);
      allText += "\n\n" + (await extractDocx(fullPath));
    } else if (ext === ".pdf") {
      console.log("  Reading:", file);
      allText += "\n\n" + (await extractPdf(fullPath));
    }
  }

  const nameCounts = extractTitleCaseNames(allText);
  const existingSlugs = new Set(
    Array.from(EXISTING_NAMES).map((n) => nameToSlug(n.replace(/\s+/g, "-")))
  );

  const newNames = [];
  for (const [name, count] of nameCounts.entries()) {
    if (count < 3) continue;
    const words = name.split(/\s+/);
    if (words.some((w) => SKIP_WORDS.has(w))) continue;
    if (words.length === 1 && count < 8) continue;
    const slug = nameToSlug(name);
    if (!slug || slug.length < 2) continue;
    if (existingSlugs.has(slug)) continue;
    newNames.push({ name, slug, count });
  }

  newNames.sort((a, b) => b.count - a.count);

  let existingLore = [];
  if (fs.existsSync(LORE_CHARACTERS_PATH)) {
    try {
      existingLore = JSON.parse(fs.readFileSync(LORE_CHARACTERS_PATH, "utf-8"));
    } catch (_) {}
  }

  const existingLoreSlugs = new Set((existingLore || []).map((c) => c.slug));
  const toAdd = newNames.filter((n) => !existingLoreSlugs.has(n.slug));

  const newRecords = toAdd.map(({ name, slug }) => ({
    id: slug,
    name,
    slug,
    blurb: "",
    bio: "",
    images: [],
    status: "new",
  }));

  const merged = [...(existingLore || []), ...newRecords];
  fs.writeFileSync(LORE_CHARACTERS_PATH, JSON.stringify(merged, null, 2), "utf-8");

  console.log("\nNew names found:", toAdd.length);
  toAdd.forEach((n) => console.log("  +", n.name, "(" + n.count + "x)"));
  console.log("\nWritten to data/lore-characters.json. Total lore characters:", merged.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

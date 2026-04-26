// @ts-nocheck
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const contentDir = path.join(rootDir, "content");
const outFile = path.join(rootDir, "app", "lib", "search-data.json");

function stripMdx(raw) {
  return raw
    .replace(/^---[\s\S]*?---\n?/, "")
    .replace(/^(import|export)[^\n]*\n/gm, "")
    .replace(/<[A-Z][^>]*\/>/g, "")
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractTitle(raw, filePath) {
  const h1 = raw.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  const base = path.basename(filePath, ".mdx");
  return base.charAt(0).toUpperCase() + base.slice(1).replace(/-/g, " ");
}

function walkMdx(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMdx(full));
    else if (entry.isFile() && entry.name.endsWith(".mdx")) results.push(full);
  }
  return results;
}

function filePathToDocPath(filePath, lang) {
  const langDir = path.join(contentDir, lang);
  let rel = path.relative(langDir, filePath).replace(/\\/g, "/");
  rel = rel.replace(/\.mdx$/, "");
  if (rel === "index") return `/${lang}`;
  rel = rel.replace(/\/index$/, "");
  return `/${lang}/${rel}`;
}

const langs = fs
  .readdirSync(contentDir)
  .filter((d) => fs.statSync(path.join(contentDir, d)).isDirectory());

/** @type {Record<string, Array<{title:string,path:string,content:string,excerpt:string}>>} */
const index = {};

for (const lang of langs) {
  const files = walkMdx(path.join(contentDir, lang));
  index[lang] = files.map((file) => {
    const raw = fs.readFileSync(file, "utf-8");
    const title = extractTitle(raw, file);
    const content = stripMdx(raw);
    const excerpt =
      content.slice(0, 160).trim() + (content.length > 160 ? "…" : "");
    return { title, path: filePathToDocPath(file, lang), content, excerpt };
  });
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(index, null, 2), "utf-8");
console.log(
  `[search-index] Generated ${Object.entries(index)
    .map(([l, e]) => `${l}:${e.length}`)
    .join(", ")} entries → app/lib/search-data.json`,
);

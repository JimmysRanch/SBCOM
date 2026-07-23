import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
const skippedTopLevelEntries = new Set([
  ".git",
  ".github",
  ".vercel",
  "dist",
  "node_modules",
  "build.mjs",
  "vercel.json",
]);

function copyDirectory(source, destination, isRoot = false) {
  mkdirSync(destination, { recursive: true });

  for (const entry of readdirSync(source)) {
    if (isRoot && skippedTopLevelEntries.has(entry)) {
      continue;
    }

    const sourcePath = join(source, entry);
    const destinationPath = join(destination, entry);

    if (statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      copyFileSync(sourcePath, destinationPath);
    }
  }
}

rmSync(output, { recursive: true, force: true });
copyDirectory(root, output, true);

const indexPath = join(output, "index.html");
const oldBookingUrl =
  "https://126-eta.vercel.app/book/b2f7dd90-b17b-4f7d-a655-3de67d1964d8";
const newBookingUrl = "https://app.zoomiegroomie.com/book/scruffy-butts";
const indexHtml = readFileSync(indexPath, "utf8");
const matches = indexHtml.split(oldBookingUrl).length - 1;

if (matches !== 1) {
  throw new Error(`Expected one old booking URL in index.html; found ${matches}.`);
}

writeFileSync(indexPath, indexHtml.replace(oldBookingUrl, newBookingUrl));
console.log(`Updated booking URL in ${indexPath}`);

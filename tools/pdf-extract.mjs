// Extract text from a PDF over a page range.
// Usage: node tools/pdf-extract.mjs <pdf-path> <start> <end>
// Output: plain text with "[--- Page N ---]" separators.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
// Worker URL must stay as file:// (Windows compatibility)
pdfjs.GlobalWorkerOptions.workerSrc = new URL("../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).href;

const [, , pdfPath, startArg, endArg] = process.argv;
if (!pdfPath || !startArg || !endArg) {
  console.error("Usage: node tools/pdf-extract.mjs <pdf-path> <start> <end>");
  process.exit(1);
}
const start = parseInt(startArg, 10);
const end   = parseInt(endArg, 10);

const data = new Uint8Array(await readFile(pdfPath));
const doc  = await pdfjs.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: false }).promise;

for (let p = start; p <= end && p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const content = await page.getTextContent();
  // Reconstruct text. Group items by Y (line) and sort by X within line.
  const items = content.items.filter(it => "str" in it);
  // Group lines using transform[5] (Y position)
  const lines = new Map();
  for (const it of items) {
    const y = Math.round(it.transform[5]);
    if (!lines.has(y)) lines.set(y, []);
    lines.get(y).push(it);
  }
  const sortedYs = [...lines.keys()].sort((a, b) => b - a); // top-to-bottom
  const text = sortedYs.map(y => lines.get(y).sort((a, b) => a.transform[4] - b.transform[4]).map(it => it.str).join("")).join("\n");
  console.log(`[--- Page ${p} ---]`);
  console.log(text);
  console.log("");
}

if (typeof doc.destroy === "function") await doc.destroy();

import { readFileSync } from "node:fs";

export function loadBannedWords(file) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(data.encoded)) throw new Error("banned word list has no encoded array");
  return data.encoded.map((item) => Buffer.from(item, "base64").toString("utf8")).filter(Boolean);
}

export function findBannedWords(text, words) {
  const hay = String(text).toLowerCase();
  const hits = [];
  for (const word of words) {
    const esc = word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`).test(hay)) hits.push(word);
  }
  return hits;
}

export function dashLines(text) {
  const lines = [];
  String(text).split("\n").forEach((line, index) => {
    if (/[\u2013\u2014]/.test(line)) lines.push(index + 1);
  });
  return lines;
}

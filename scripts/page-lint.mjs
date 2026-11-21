// Mechanical checks for one search page. The review skill still reads the claims.
//   node scripts/page-lint.mjs page.md
//   node scripts/page-lint.mjs page.md --json
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findBannedWords, loadBannedWords, dashLines } from "./lib/words.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_GRADE = 8;
const FAIL_GRADE = 10;
const ADJECTIVES = new Set([
  "bold", "simple", "powerful", "robust", "modern", "innovative", "smart",
  "easy", "great", "best", "unique", "comprehensive", "actionable",
]);
const STOCK = [
  "here's the thing",
  "let's dive in",
  "in today's world",
  "buckle up",
  "let me be honest",
  "i'll be real with you",
  "will change everything",
];
const STOP = new Set([
  "a", "an", "the", "of", "and", "to", "for", "in", "on", "is", "are", "how",
  "what", "why", "when", "with", "your", "our", "this", "that", "from",
]);

export function wordsOf(text) {
  return String(text).match(/[A-Za-z0-9]+(?:'[A-Za-z0-9]+)*/g) || [];
}

export function syllables(word) {
  const raw = String(word).toLowerCase().replace(/[^a-z]/g, "");
  if (!raw) return 0;
  if (raw.length <= 3) return 1;
  const trimmed = raw.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function splitSentences(text) {
  const cleaned = String(text).replace(/\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e|U\.S|U\.K)\./gi, (match) => match.replace(/\./g, ""));
  return cleaned.split(/(?<=[.!?])\s+/).map((part) => part.trim()).filter(Boolean);
}

export function readingGrade(text) {
  const sentences = splitSentences(text).filter((sentence) => wordsOf(sentence).length > 0);
  const words = wordsOf(text);
  if (!sentences.length || !words.length) return null;
  const syll = words.reduce((sum, word) => sum + syllables(word), 0);
  return 0.39 * (words.length / sentences.length) + 11.8 * (syll / words.length) - 15.59;
}

function frontmatter(raw) {
  const match = String(raw).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!pair) continue;
    let value = pair[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[pair[1]] = value;
  }
  return data;
}

function withoutFrontmatter(raw) {
  return String(raw).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function prose(raw) {
  let text = withoutFrontmatter(raw);
  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/<[^>]+>/g, " ");
  return text;
}

function opening(raw) {
  const body = withoutFrontmatter(raw).replace(/```[\s\S]*?```/g, " ");
  const chunk = body.split(/^##\s+/m)[0].replace(/^#\s+.+$/m, " ");
  return prose(`---\n\n---\n${chunk}`);
}

function h1(raw) {
  const match = withoutFrontmatter(raw).match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function sections(raw) {
  const body = withoutFrontmatter(raw).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/```[\s\S]*?```/g, " ");
  return body.split(/^##\s+/m).slice(1).map((part) => {
    const lines = part.split(/\r?\n/);
    const heading = lines[0].trim();
    const rest = lines.slice(1).join("\n").replace(/^#{1,6}\s+.*$/gm, " ");
    const first = splitSentences(prose(`---\n\n---\n${rest}`))[0] || "";
    return { heading, first };
  });
}

function linksOf(raw) {
  const found = [];
  const re = /(!?)\[([^\]]*)\]\(([^)\s]+)\)/g;
  let match;
  const body = withoutFrontmatter(raw);
  while ((match = re.exec(body))) {
    found.push({ image: match[1] === "!", text: match[2], href: match[3] });
  }
  return found;
}

function visibleFaqs(raw) {
  const body = withoutFrontmatter(raw).replace(/```[\s\S]*?```/g, "");
  const faq = body.split(/^##\s+FAQ\s*$/im)[1];
  if (!faq) return [];
  const chunk = faq.split(/^##\s+/m)[0];
  return [...chunk.matchAll(/^###\s+(.+)$/gm)].map((match) => match[1].trim());
}

function markupFaqs(raw) {
  const blocks = [];
  for (const match of String(raw).matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    blocks.push(match[1]);
  }
  for (const match of String(raw).matchAll(/```json\s*([\s\S]*?)```/gi)) blocks.push(match[1]);
  const names = [];
  for (const block of blocks) {
    let data;
    try { data = JSON.parse(block); } catch { continue; }
    const nodes = Array.isArray(data) ? data : [data];
    for (const node of nodes) collectFaq(node, names);
  }
  return names;
}

function collectFaq(node, names) {
  if (!node || typeof node !== "object") return;
  if (node["@type"] === "FAQPage" && Array.isArray(node.mainEntity)) {
    for (const item of node.mainEntity) {
      const name = item.name || item?.acceptedAnswer?.name;
      if (typeof name === "string") names.push(name.trim());
    }
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") collectFaq(value, names);
  }
}

function sameSet(left, right) {
  if (left.length !== right.length) return false;
  const b = [...right].sort();
  return [...left].sort().every((item, index) => item === b[index]);
}

export function lintPage(raw, words = []) {
  const failures = [];
  const warnings = [];
  const meta = frontmatter(raw);
  const title = meta.title || "";
  const description = meta.description || "";
  const keyword = (meta.keyword || "").toLowerCase();
  const conversion = meta.conversion || "";
  const pageType = meta.page_type || "";
  const text = prose(raw);
  const grade = readingGrade(text);

  if (!title) failures.push("title-missing: add a title in frontmatter");
  else if (title.length > 60) failures.push(`title-length: title is ${title.length} characters, the max is 60`);
  if (description.length < 120 || description.length > 158) {
    failures.push(`description-length: description is ${description.length} characters, the range is 120 to 158`);
  }
  if (!keyword) failures.push("keyword-missing: add a keyword in frontmatter");
  const places = [
    ["title", title],
    ["h1", h1(raw)],
    ["opening", opening(raw)],
  ];
  if (keyword) {
    for (const [place, value] of places) {
      if (!value.toLowerCase().includes(keyword)) failures.push(`keyword-${place}: the keyword is not in the ${place}`);
    }
  }
  const lead = wordsOf(opening(raw));
  if (lead.length === 0) failures.push("opening-missing: put the answer before the first heading");
  else if (lead.length > 60) failures.push(`opening-length: the answer is ${lead.length} words, keep it inside 60`);

  if (grade === null) failures.push("grade-missing: the page has no sentences to grade");
  else if (grade > FAIL_GRADE) failures.push(`grade: reading grade is ${grade.toFixed(1)}, fail above ${FAIL_GRADE}`);
  else if (grade > TARGET_GRADE) warnings.push(`grade: reading grade is ${grade.toFixed(1)}, target is ${TARGET_GRADE}`);

  for (const sentence of splitSentences(text)) {
    const count = wordsOf(sentence).length;
    if (count > 30) failures.push(`sentence-length: ${count} words in "${sentence.slice(0, 80)}"`);
  }

  for (const section of sections(raw)) {
    const count = wordsOf(section.first).length;
    if (!section.first) failures.push(`heading-answer: ## ${section.heading} has no sentence under it`);
    else if (count > 25) failures.push(`heading-answer: ## ${section.heading} first sentence is ${count} words, the max is 25`);
    else if (section.first.trim().endsWith("?")) failures.push(`heading-answer: ## ${section.heading} starts with a question`);
    else {
      const keys = wordsOf(section.heading).map((word) => word.toLowerCase()).filter((word) => word.length > 3 && !STOP.has(word));
      if (keys.length && !keys.some((word) => section.first.toLowerCase().includes(word))) {
        failures.push(`heading-answer: ## ${section.heading} first sentence does not answer the heading`);
      }
    }
  }

  const links = linksOf(raw).filter((link) => !link.image);
  const internal = [...new Set(links.map((link) => link.href).filter((href) => href.startsWith("/") && href !== conversion))];
  if (internal.length < 2) failures.push(`internal-links: found ${internal.length}, need at least 2`);
  if (!conversion) failures.push("conversion-missing: add conversion in frontmatter");
  else if (!links.some((link) => link.href === conversion)) failures.push("conversion-link: the conversion URL is not linked in the page");

  for (const link of linksOf(raw).filter((link) => link.image)) {
    if (!link.text.trim()) failures.push(`alt-text: image ${link.href} has no alt text`);
  }
  for (const match of withoutFrontmatter(raw).matchAll(/<img\b[^>]*>/gi)) {
    const alt = match[0].match(/\balt=["']([^"']*)["']/i);
    if (!alt || !alt[1].trim()) failures.push("alt-text: an img tag has no alt text");
  }

  const seen = visibleFaqs(raw);
  const marked = markupFaqs(raw);
  if (seen.length || marked.length) {
    if (!sameSet(seen, marked)) failures.push("faq-markup: visible FAQ questions and FAQ markup do not match");
  }

  if (dashLines(raw).length) failures.push("dash: the page has an em dash or an en dash");
  for (const hit of findBannedWords(raw, words)) failures.push(`banned-word: ${hit}`);

  const lower = text.toLowerCase();
  for (const phrase of STOCK) {
    if (lower.includes(phrase)) failures.push(`ai-tell: stock phrase "${phrase}"`);
  }
  if (/\bit(?:'s| is) not\b[^.]{0,80},\s*it(?:'s| is)\b/i.test(text)) failures.push("ai-tell: flip frame");
  if (/\bthis isn(?:'t| is not) about\b[^.]{0,80}\.\s*it(?:'s| is) about\b/i.test(text)) failures.push("ai-tell: flip frame");
  const tags = text.match(/#[A-Za-z][A-Za-z0-9_]*/g) || [];
  if (tags.length >= 3) failures.push("ai-tell: hashtag wall");
  const last = splitSentences(text).at(-1) || "";
  if (/^(thoughts|agree)\?$/i.test(last.trim())) failures.push("ai-tell: closing bait");
  if (/\b(?:truly|incredibly)\b/i.test(text)) failures.push("ai-tell: empty intensifier");
  for (const match of text.matchAll(/\b([A-Za-z]+),\s+([A-Za-z]+),\s+([A-Za-z]+)\s+[A-Za-z]+/g)) {
    if ([match[1], match[2], match[3]].every((word) => ADJECTIVES.has(word.toLowerCase()))) {
      failures.push("ai-tell: stacked adjectives");
    }
  }

  if (pageType === "compare") {
    const named = meta.named_product_url || "";
    if (!meta.named_product || !named) failures.push("named-product: a comparison needs named_product and named_product_url");
    else if (!raw.includes(named)) failures.push("named-product: the named product URL is not in the page");
  }

  return {
    pass: failures.length === 0,
    grade: grade === null ? null : Math.round(grade * 10) / 10,
    target_grade: TARGET_GRADE,
    fail_above: FAIL_GRADE,
    failures,
    warnings,
  };
}

function printReport(report) {
  console.log(report.pass ? "PASS" : "FAIL");
  if (report.grade !== null) console.log(`grade: ${report.grade} (target ${report.target_grade}, fail above ${report.fail_above})`);
  for (const line of report.failures) console.log(`fail: ${line}`);
  for (const line of report.warnings) console.log(`warn: ${line}`);
}

function main() {
  const file = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  if (!file) {
    console.log("Usage: node scripts/page-lint.mjs <page.md> [--json]");
    process.exit(1);
  }
  const words = loadBannedWords(path.join(root, "scripts/banned-words.json"));
  const report = lintPage(readFileSync(file, "utf8"), words);
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else printReport(report);
  process.exit(report.pass ? 0 : 1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

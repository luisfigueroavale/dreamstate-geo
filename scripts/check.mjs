// Repo check. Run with --strict when .banned-terms.local is on this machine.
//   node scripts/check.mjs
//   node scripts/check.mjs --strict
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readdirSync, readlinkSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "./lib/schema.mjs";
import { dashLines, findBannedWords, loadBannedWords } from "./lib/words.mjs";

const TEXT = /\.(md|mjs|js|css|json|ya?ml|txt|html)$/i;
const SKIP = new Set([".git", "node_modules", "work", "brand.local", "audience.local", "search.local"]);
const NEVER = [
  /^brand\.local(\/|$)/,
  /^audience\.local(\/|$)/,
  /^search\.local(\/|$)/,
  /(^|\/)\.banned-terms\.local$/,
  /(^|\/)work\//,
  /(^|\/)\.env/,
  /\.key$/,
  /credentials.*\.json$/i,
];
const SECRET = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /\bsk_(?:live|test)_[A-Za-z0-9]{8,}\b/,
  /\b(?:api[_-]?key|access[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{12,}['"]/i,
];
const MACHINE_PARTS = ["/Use" + "rs/", "/ho" + "me/", "/priv" + "ate/", "/opt/" + "cursor/"];
const DOTTED = /^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9_]+)+$/;
const QUOTE = "quote first, wait for the owner's yes";
const SCHEMA_FILES = {
  "search/targets.json": "scripts/schemas/targets.schema.json",
  "search/changes.json": "scripts/schemas/changes.schema.json",
  "examples/sample-site/brief.json": "scripts/schemas/brief.schema.json",
  "examples/sample-site/lint-report.json": "scripts/schemas/lint-report.schema.json",
  "examples/sample-site/reading.json": "scripts/schemas/reading.schema.json",
};
const MAX_BYTES = 5 * 1024 * 1024;

export function capabilityIds(text) {
  const ids = new Set();
  for (const match of String(text).matchAll(/`([^`]+)`/g)) {
    const token = match[1].trim();
    if (DOTTED.test(token)) ids.add(token);
  }
  return ids;
}

export function parseToolMap(text) {
  const ids = new Set();
  const paid = new Set();
  const bare = new Set();
  for (const match of String(text).matchAll(/`([^`]+)`/g)) {
    const token = match[1].trim();
    if (DOTTED.test(token)) ids.add(token);
  }
  for (const line of String(text).split("\n")) {
    if (line.startsWith("Bare ids:")) {
      for (const match of line.matchAll(/`([^`]+)`/g)) {
        bare.add(match[1].trim());
        ids.add(match[1].trim());
      }
    }
  }
  const paidBlock = String(text).split(/^## Paid ids\s*$/m)[1]?.split(/^## /m)[0] || "";
  for (const match of paidBlock.matchAll(/`([^`]+)`/g)) {
    if (DOTTED.test(match[1].trim())) paid.add(match[1].trim());
  }
  return { ids, paid, bare };
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const info = lstatSync(full);
    if (info.isSymbolicLink()) continue;
    if (info.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function tracked(root) {
  try {
    const out = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return out.split("\0").filter(Boolean);
  } catch {
    return null;
  }
}

export function bannedTermsPath(root) {
  const here = path.join(root, ".banned-terms.local");
  if (existsSync(here)) return here;
  try {
    const common = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const main = path.join(path.dirname(common), ".banned-terms.local");
    if (existsSync(main)) return main;
  } catch {
    return null;
  }
  return null;
}

function readTerms(file) {
  return readFileSync(file, "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
}

function matchesTerm(text, term) {
  const esc = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`).test(text.toLowerCase());
}

export function runChecks(root, argv = []) {
  const strict = argv.includes("--strict");
  const errors = [];
  const notes = [];
  const bad = (message) => errors.push(message);
  const files = walk(root).map((full) => path.relative(root, full).split(path.sep).join("/"));
  const text = files.filter((file) => TEXT.test(file));

  for (const file of files) {
    const size = statSync(path.join(root, file)).size;
    if (size > MAX_BYTES) bad(`${file} is over 5 MB`);
  }

  const bannedWords = loadBannedWords(path.join(root, "scripts/banned-words.json"));
  for (const file of text) {
    if (file === "scripts/banned-words.json") continue;
    const body = readFileSync(path.join(root, file), "utf8");
    for (const line of dashLines(body)) bad(`${file}:${line} has an em dash or an en dash`);
    for (const word of findBannedWords(body, bannedWords)) bad(`${file} uses a banned word (${word})`);
    for (const pattern of SECRET) if (pattern.test(body)) bad(`${file} looks like it contains a secret`);
    if (MACHINE_PARTS.some((part) => body.includes(part))) bad(`${file} contains a machine path`);
  }

  for (const file of tracked(root) || []) {
    if (NEVER.some((pattern) => pattern.test(file))) bad(`${file} is tracked and must stay local`);
  }

  const agents = path.join(root, "AGENTS.md");
  const claude = path.join(root, "CLAUDE.md");
  if (!existsSync(agents) || !existsSync(claude)) bad("AGENTS.md and CLAUDE.md are both required");
  else if (readFileSync(agents, "utf8") !== readFileSync(claude, "utf8")) bad("AGENTS.md and CLAUDE.md differ");

  for (const link of [".agents/skills", ".claude/skills"]) {
    const full = path.join(root, link);
    if (!existsSync(full) || !lstatSync(full).isSymbolicLink()) bad(`${link} should be a symlink to ../skills`);
    else if (readlinkSync(full) !== "../skills") bad(`${link} should point at ../skills`);
  }

  const skillRoot = path.join(root, "skills");
  const folders = existsSync(skillRoot) ? readdirSync(skillRoot).filter((name) => statSync(path.join(skillRoot, name)).isDirectory()) : [];
  if (folders.length !== 14) bad(`expected 14 skills, found ${folders.length}`);
  for (const name of folders) {
    const file = path.join(skillRoot, name, "SKILL.md");
    const rel = `skills/${name}/SKILL.md`;
    if (!existsSync(file)) { bad(`${rel} is missing`); continue; }
    const body = readFileSync(file, "utf8");
    const head = body.match(/^---\n([\s\S]*?)\n---/);
    if (!head) { bad(`${rel} has no frontmatter`); continue; }
    if (!new RegExp(`^name:\\s*${name}\\s*$`, "m").test(head[1])) bad(`${rel} name does not match its folder`);
    if (!/^description:\s+".+"\s*$/m.test(head[1])) bad(`${rel} needs a quoted description`);
    if (!body.includes("docs/skill-frame.md")) bad(`${rel} does not point at docs/skill-frame.md`);
    if (!body.includes("## Use when")) bad(`${rel} has no Use when section`);
    const steps = body.match(/^## Steps\s*\n([\s\S]*?)(?=^## )/m);
    if (!steps) bad(`${rel} has no Steps section`);
    else {
      const lines = steps[1].split("\n").map((line) => line.trim()).filter((line) => /^\d+\.\s/.test(line));
      if (!lines.length) bad(`${rel} has no numbered steps`);
      for (const line of lines) {
        const ref = line.match(/references\/([a-z0-9-]+\.md)/);
        if (!ref) bad(`${rel} step does not point at a reference: ${line}`);
        else if (!existsSync(path.join(skillRoot, name, "references", ref[1]))) bad(`${rel} missing references/${ref[1]}`);
      }
    }
    for (const ref of body.matchAll(/references\/([a-z0-9-]+\.md)/g)) {
      if (!existsSync(path.join(skillRoot, name, "references", ref[1]))) bad(`${rel} missing references/${ref[1]}`);
    }
  }

  for (const [file, schemaPath] of Object.entries(SCHEMA_FILES)) {
    const full = path.join(root, file);
    const schemaFull = path.join(root, schemaPath);
    if (!existsSync(full)) { bad(`${file} is missing`); continue; }
    const data = JSON.parse(readFileSync(full, "utf8"));
    const schema = JSON.parse(readFileSync(schemaFull, "utf8"));
    for (const error of validate(data, schema)) bad(`${file} ${error}`);
    if (file.startsWith("examples/") && data.fictional !== true) bad(`${file} must be marked fictional`);
  }
  const changesPath = path.join(root, "search/changes.json");
  if (existsSync(changesPath)) {
    const changes = JSON.parse(readFileSync(changesPath, "utf8"));
    if (!changes.changes?.length) bad("search/changes.json needs one marked example");
    for (const change of changes.changes || []) {
      if (change.example !== true) bad(`search/changes.json entry ${change.id || "(no id)"} must set example true`);
    }
  }
  const targetsPath = path.join(root, "search/targets.json");
  if (existsSync(targetsPath)) {
    const targets = JSON.parse(readFileSync(targetsPath, "utf8"));
    const seen = new Set((targets.metrics || []).map((metric) => metric.id));
    for (const id of ["answer_mention_rate", "answer_citation_share", "nonbrand_clicks_28d", "nonbrand_impressions_28d", "queries_in_top10", "priority_pages_indexed_pct"]) {
      if (!seen.has(id)) bad(`search/targets.json is missing ${id}`);
    }
  }

  for (const file of text.filter((item) => item.endsWith(".md"))) {
    const body = readFileSync(path.join(root, file), "utf8");
    for (const match of body.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      let target = match[1].split("#")[0].split("?")[0];
      if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("/")) continue;
      target = decodeURIComponent(target);
      if (!existsSync(path.resolve(root, path.dirname(file), target))) bad(`${file} links to missing ${match[1]}`);
    }
  }

  const mapFile = path.join(root, "docs/tool-map.md");
  if (!existsSync(mapFile)) bad("docs/tool-map.md is missing");
  else {
    const map = parseToolMap(readFileSync(mapFile, "utf8"));
    const skillFiles = files.filter((file) => file.startsWith("skills/") && file.endsWith(".md"));
    for (const file of skillFiles) {
      const body = readFileSync(path.join(root, file), "utf8");
      for (const id of capabilityIds(body)) {
        if (!map.ids.has(id)) bad(`${file} names ${id}, which is not in docs/tool-map.md`);
      }
      for (const id of map.bare) {
        if (body.includes(`\`${id}\``) && !map.ids.has(id)) bad(`${file} names ${id}, which is not in docs/tool-map.md`);
      }
    }
    const combined = new Map();
    for (const name of folders) {
      const dir = path.join(skillRoot, name);
      let blob = "";
      if (existsSync(dir)) {
        for (const file of walk(dir)) blob += `\n${readFileSync(file, "utf8")}`;
      }
      combined.set(name, blob);
    }
    for (const [name, blob] of combined) {
      for (const id of map.paid) {
        if (blob.includes(id) && !blob.includes(QUOTE)) bad(`skills/${name} names paid ${id} without: ${QUOTE}`);
      }
    }
    if (existsSync(targetsPath)) {
      const targets = JSON.parse(readFileSync(targetsPath, "utf8"));
      for (const metric of targets.metrics || []) {
        if (!map.ids.has(metric.source)) bad(`search/targets.json source ${metric.source} is not in docs/tool-map.md`);
      }
    }
  }

  const terms = bannedTermsPath(root);
  if (!terms) {
    notes.push("BANNED-TERM SCAN SKIPPED");
    if (strict) bad("strict mode needs .banned-terms.local");
  } else {
    const list = readTerms(terms);
    for (const file of text) {
      const body = readFileSync(path.join(root, file), "utf8");
      for (const term of list) {
        if (matchesTerm(body, term)) bad(`${file} contains a banned term`);
      }
    }
    notes.push(`banned-term scan: ${list.length} terms, ${text.length} files`);
  }

  return { errors, notes, files: text.length };
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const { errors, notes, files } = runChecks(root, process.argv.slice(2));
  for (const note of notes) console.log(note);
  for (const error of errors) console.error(`FAIL ${error}`);
  if (errors.length) {
    console.error(`${errors.length} check(s) failed`);
    process.exit(1);
  }
  console.log(`ok: ${files} text files checked`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

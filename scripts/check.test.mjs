import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readlinkSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { bannedTermsPath, capabilityIds, parseToolMap, runChecks } from "./check.mjs";
import { validate } from "./lib/schema.mjs";
import { findBannedWords, loadBannedWords } from "./lib/words.mjs";

const root = path.resolve(import.meta.dirname, "..");

test("the repo check passes", () => {
  const result = runChecks(root, []);
  assert.deepEqual(result.errors, [], result.errors.join("\n"));
});

test("strict passes when the local name list is on disk", () => {
  if (!existsSync(path.join(root, ".banned-terms.local"))) return;
  const result = runChecks(root, ["--strict"]);
  assert.deepEqual(result.errors, [], result.errors.join("\n"));
  assert.ok(result.notes.some((note) => note.startsWith("banned-term scan:")));
});

test("strict fails when the name list is missing", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "geo-check-"));
  mkdirSync(path.join(dir, "scripts"), { recursive: true });
  writeFileSync(path.join(dir, "scripts/banned-words.json"), readFileSync(path.join(root, "scripts/banned-words.json")));
  const result = runChecks(dir, ["--strict"]);
  assert.ok(result.notes.includes("BANNED-TERM SCAN SKIPPED"));
  assert.ok(result.errors.some((error) => error.includes("strict mode")));
  rmSync(dir, { recursive: true, force: true });
});

test("a banned term in a text file fails the scan", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "geo-term-"));
  mkdirSync(path.join(dir, "scripts"), { recursive: true });
  writeFileSync(path.join(dir, "scripts/banned-words.json"), readFileSync(path.join(root, "scripts/banned-words.json")));
  writeFileSync(path.join(dir, ".banned-terms.local"), "zzforbiddenname\n");
  writeFileSync(path.join(dir, "note.md"), "This note names zzforbiddenname in passing.\n");
  const result = runChecks(dir, []);
  assert.ok(result.errors.some((error) => error.includes("banned term")));
  rmSync(dir, { recursive: true, force: true });
});

test("capability ids in skills are a subset of the tool map", () => {
  const map = parseToolMap(readFileSync(path.join(root, "docs/tool-map.md"), "utf8"));
  assert.ok(map.paid.has("visibility.research.web_search"));
  assert.ok(map.paid.has("visibility.probe.start"));
  assert.ok(map.ids.has("whoami"));
  const found = capabilityIds("`visibility.keywords_get` and `brand.local/voice.md`");
  assert.deepEqual([...found], ["visibility.keywords_get"]);
});

test("banned words decode and match a whole word only", () => {
  const list = loadBannedWords(path.join(root, "scripts/banned-words.json"));
  assert.equal(list.length, 15);
  const sample = Buffer.from(list[0], "utf8").toString("base64");
  assert.equal(typeof sample, "string");
  assert.deepEqual(findBannedWords(`please ${list[4]} this`, list), [list[4]]);
  assert.deepEqual(findBannedWords(`${list[4]}ed`, list), []);
});

test("schema rejects an unexpected change field", () => {
  const schema = JSON.parse(readFileSync(path.join(root, "scripts/schemas/changes.schema.json"), "utf8"));
  const data = JSON.parse(readFileSync(path.join(root, "search/changes.json"), "utf8"));
  assert.deepEqual(validate(data, schema), []);
  data.changes[0].extra = true;
  assert.ok(validate(data, schema).length > 0);
});

test("a worktree falls back to the main checkout name list", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "geo-wt-"));
  const git = ["-c", "user.email=test@example.com", "-c", "user.name=Test"];
  execFileSync("git", ["init"], { cwd: dir });
  writeFileSync(path.join(dir, ".gitignore"), ".banned-terms.local\n");
  writeFileSync(path.join(dir, "README.md"), "placeholder\n");
  execFileSync("git", [...git, "add", "-A"], { cwd: dir });
  execFileSync("git", [...git, "commit", "-m", "init"], { cwd: dir });
  writeFileSync(path.join(dir, ".banned-terms.local"), "zzworktreename\n");
  const wt = path.join(dir, "wt");
  execFileSync("git", ["worktree", "add", "--detach", wt], { cwd: dir });
  try {
    assert.equal(existsSync(path.join(wt, ".banned-terms.local")), false);
    assert.equal(bannedTermsPath(wt), path.join(dir, ".banned-terms.local"));
  } finally {
    execFileSync("git", ["worktree", "remove", "--force", wt], { cwd: dir });
    rmSync(dir, { recursive: true, force: true });
  }
});

test("skill symlinks point at skills", () => {
  for (const link of [".agents/skills", ".claude/skills"]) {
    assert.equal(readlinkSync(path.join(root, link)), "../skills");
  }
});

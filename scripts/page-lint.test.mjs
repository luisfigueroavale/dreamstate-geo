import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { loadBannedWords } from "./lib/words.mjs";
import { lintPage, readingGrade } from "./page-lint.mjs";

const root = path.resolve(import.meta.dirname, "..");
const words = loadBannedWords(path.join(root, "scripts/banned-words.json"));
const samplePath = path.join(root, "examples/sample-site/page.md");
const sample = readFileSync(samplePath, "utf8");

function lint(raw) {
  return lintPage(raw, words);
}

test("the fictional sample page passes", () => {
  const report = lint(sample);
  assert.equal(report.pass, true);
  assert.ok(report.grade <= 10);
  const stored = JSON.parse(readFileSync(path.join(root, "examples/sample-site/lint-report.json"), "utf8"));
  assert.equal(stored.pass, report.pass);
  assert.equal(stored.grade, report.grade);
  assert.equal(stored.fictional, true);
});

test("a missing keyword, a long title, and a short description fail", () => {
  const noKeyword = sample.replace('keyword: "shared weekly plan"', 'keyword: "zzzzmissing"');
  assert.ok(lint(noKeyword).failures.some((line) => line.startsWith("keyword-")));
  const longTitle = "x".repeat(61);
  const titled = sample.replace('title: "Shared weekly plan: Cedar Line and Maple Sheet"', `title: "${longTitle}"`);
  assert.ok(lint(titled).failures.some((line) => line.startsWith("title-length")));
  const short = sample.replace(/description: ".*"/, 'description: "Too short to use."');
  assert.ok(lint(short).failures.some((line) => line.startsWith("description-length")));
});

test("dashes, banned words, and stock phrases fail", () => {
  const dash = String.fromCharCode(0x2014);
  assert.ok(lint(sample + dash).failures.some((line) => line.startsWith("dash")));
  const banned = Buffer.from("dW5sb2Nr", "base64").toString("utf8");
  assert.ok(lint(`${sample}\n\n${banned} is not allowed here.`).failures.some((line) => line.startsWith("banned-word")));
  assert.ok(lint(`${sample}\n\nIt is not a list, it is a trap.`).failures.some((line) => line.includes("flip frame")));
  assert.ok(lint(`${sample}\n\nIn today's world the shop opens.`).failures.some((line) => line.includes("stock phrase")));
});

test("links, alt text, faq markup, and a long sentence fail", () => {
  const noLinks = sample.replace("[how the week is planned](/guides/week)", "the week").replace("[what the shop tracks](/guides/track)", "the track");
  assert.ok(lint(noLinks).failures.some((line) => line.startsWith("internal-links")));
  const noAlt = sample.replace("![A paper list on a shop counter](list.png)", "![](list.png)");
  assert.ok(lint(noAlt).failures.some((line) => line.startsWith("alt-text")));
  const badFaq = sample.replace("### Who is this example for?", "### Who is the page for?");
  assert.ok(lint(badFaq).failures.some((line) => line.startsWith("faq-markup")));
  const long = "word ".repeat(31).trim() + ".";
  const withLong = sample.replace(
    "Cedar Line keeps one list, and both people edit the same lines.",
    `Cedar Line keeps one list, and both people edit the same lines.\n\n${long}`,
  );
  assert.ok(lint(withLong).failures.some((line) => line.startsWith("sentence-length")));
});

test("a heading that does not answer itself fails", () => {
  const swapped = sample.replace(
    "A shared weekly plan includes the work, the owner, and the day it is due.",
    "Monday is a fine day for soup and bread.",
  );
  assert.ok(lint(swapped).failures.some((line) => line.startsWith("heading-answer")));
});

test("reading grade is a number for a normal sentence", () => {
  const grade = readingGrade("A short list helps a small shop plan the week. Both owners can see it.");
  assert.equal(typeof grade, "number");
  assert.ok(grade < 10);
});

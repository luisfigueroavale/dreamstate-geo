import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { readChanges } from "./read-changes.mjs";

const root = path.resolve(import.meta.dirname, "..");
const rules = JSON.parse(readFileSync(path.join(root, "scripts/reading-rules.json"), "utf8"));

function day(date, clicks, impressions, position = 10) {
  return { date, clicks, impressions, position };
}

function run(changes, pages, asOf = "2026-03-20") {
  return readChanges({ changes: { changes }, rows: { pages }, asOf });
}

test("the sample fixture shows an early thin reading, a better full reading, and a final reading that is not due", () => {
  const changes = JSON.parse(readFileSync(path.join(root, "scripts/fixtures/sample-changes.json"), "utf8"));
  const rows = JSON.parse(readFileSync(path.join(root, "scripts/fixtures/sample-rows.json"), "utf8"));
  const result = readChanges({ changes, rows, asOf: "2026-03-20" });
  const byWindow = Object.fromEntries(result.readings.map((reading) => [reading.window_days, reading]));
  assert.equal(byWindow[14].verdict, "too little data");
  assert.equal(byWindow[28].verdict, "better");
  assert.equal(byWindow[28].adjusted_ctr, 0.07);
  assert.equal(byWindow[56].due, false);
  assert.equal(byWindow[56].verdict, null);
  assert.equal(result.data_end, "2026-03-17");
  const stored = JSON.parse(readFileSync(path.join(root, "examples/sample-site/reading.json"), "utf8"));
  assert.equal(stored.fictional, true);
  assert.equal(stored.result.readings.find((reading) => reading.window_days === 28).verdict, "better");
});

test("a site-wide swing is not credited to the edited page", () => {
  const pages = [
    { url: "/a", page_type: "how-to", days: [day("2026-01-04", 10, 200), day("2026-02-01", 20, 400)] },
    { url: "/b", page_type: "how-to", days: [day("2026-01-04", 10, 200), day("2026-02-01", 20, 400)] },
  ];
  const result = run([
    { example: false, id: "a", page: "/a", page_type: "how-to", kind: "refresh", shipped_on: "2026-01-30", first_crawled_on: "2026-02-01" },
  ], pages);
  const full = result.readings.find((reading) => reading.window_days === 28);
  assert.equal(full.verdict, "no clear change");
  assert.equal(full.adjusted_ctr, 0);
});

test("the page can be worse after the control is subtracted", () => {
  const pages = [
    { url: "/a", page_type: "how-to", days: [day("2026-01-04", 20, 200), day("2026-02-01", 20, 200)] },
    { url: "/b", page_type: "how-to", days: [day("2026-01-04", 4, 200), day("2026-02-01", 20, 200)] },
  ];
  const result = run([
    { example: false, id: "a", page: "/a", page_type: "how-to", kind: "refresh", shipped_on: "2026-01-30", first_crawled_on: "2026-02-01" },
  ], pages);
  assert.equal(result.readings.find((reading) => reading.window_days === 28).verdict, "worse");
});

test("under 100 impressions is too little data, and 100 is enough", () => {
  const change = { example: false, id: "a", page: "/a", page_type: "how-to", kind: "refresh", shipped_on: "2026-01-30", first_crawled_on: "2026-02-01" };
  const thin = run([change], [
    { url: "/a", page_type: "how-to", days: [day("2026-01-04", 10, 99), day("2026-02-01", 20, 200)] },
    { url: "/b", page_type: "how-to", days: [day("2026-01-04", 10, 200), day("2026-02-01", 10, 200)] },
  ]);
  assert.equal(thin.readings.find((reading) => reading.window_days === 28).verdict, "too little data");
  const enough = run([change], [
    { url: "/a", page_type: "how-to", days: [day("2026-01-04", 10, 100), day("2026-02-01", 40, 200)] },
    { url: "/b", page_type: "how-to", days: [day("2026-01-04", 10, 100), day("2026-02-01", 10, 100)] },
  ]);
  assert.equal(enough.readings.find((reading) => reading.window_days === 28).verdict, "better");
});

test("no control pages is too little data", () => {
  const result = run([
    { example: false, id: "a", page: "/a", page_type: "how-to", kind: "refresh", shipped_on: "2026-01-30", first_crawled_on: "2026-02-01" },
  ], [
    { url: "/a", page_type: "how-to", days: [day("2026-01-04", 10, 200), day("2026-02-01", 20, 200)] },
  ]);
  assert.equal(result.readings.find((reading) => reading.window_days === 28).verdict, "too little data");
});

test("two flat full readings pause that kind, and a later better reading does not", () => {
  const flatDays = [day("2026-01-04", 10, 200), day("2026-02-01", 10, 200), day("2026-02-20", 10, 200), day("2026-03-10", 10, 200)];
  const pages = [
    { url: "/a", page_type: "how-to", days: flatDays },
    { url: "/b", page_type: "how-to", days: flatDays },
    { url: "/c", page_type: "how-to", days: flatDays },
  ];
  const paused = run([
    { example: false, id: "a", page: "/a", page_type: "how-to", kind: "refresh", shipped_on: "2026-01-30", first_crawled_on: "2026-02-01" },
    { example: false, id: "b", page: "/b", page_type: "how-to", kind: "refresh", shipped_on: "2026-02-15", first_crawled_on: "2026-02-20" },
  ], pages, "2026-04-30");
  assert.deepEqual(paused.pause_kinds, ["refresh"]);

  const lifted = run([
    { example: false, id: "a", page: "/a", page_type: "how-to", kind: "refresh", shipped_on: "2026-01-30", first_crawled_on: "2026-02-01" },
    { example: false, id: "b", page: "/b", page_type: "how-to", kind: "refresh", shipped_on: "2026-02-15", first_crawled_on: "2026-02-20" },
  ], [
    { url: "/a", page_type: "how-to", days: flatDays },
    { url: "/b", page_type: "how-to", days: [day("2026-01-04", 10, 200), day("2026-02-20", 10, 200), day("2026-03-10", 80, 200)] },
    { url: "/c", page_type: "how-to", days: flatDays },
  ], "2026-04-30");
  assert.deepEqual(lifted.pause_kinds, []);
});

test("example rows are skipped unless asked for", () => {
  const changes = JSON.parse(readFileSync(path.join(root, "search/changes.json"), "utf8"));
  assert.equal(changes.changes.every((change) => change.example === true), true);
  const skipped = readChanges({ changes, rows: { pages: [] }, asOf: "2026-03-20" });
  assert.equal(skipped.readings.length, 0);
  const included = readChanges({ changes, rows: { pages: [] }, asOf: "2026-03-20", includeExamples: true });
  assert.ok(included.readings.length > 0);
});

test("measuring.md states the same thresholds as the rules file", () => {
  const doc = readFileSync(path.join(root, "docs/measuring.md"), "utf8");
  assert.ok(doc.includes(String(rules.min_impressions)));
  assert.ok(doc.includes(String(rules.better_adjusted_ctr)));
  assert.ok(doc.includes(String(rules.worse_adjusted_ctr)));
  assert.ok(doc.includes(String(rules.lag_days)));
  assert.deepEqual(rules.reading_days, [14, 28, 56]);
  assert.equal(rules.full_reading_days, 28);
});

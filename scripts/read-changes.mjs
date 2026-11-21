// Compare equal windows before and after a change, then subtract the control group.
//   node scripts/read-changes.mjs --changes search.local/changes.json --rows work/rows.json --as-of 2026-03-20
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RULES = JSON.parse(readFileSync(path.join(root, "scripts/reading-rules.json"), "utf8"));
const DAY = 86400000;

function parseDay(iso) {
  const [year, month, date] = String(iso).split("-").map(Number);
  if (!year || !month || !date) throw new Error(`bad date ${iso}`);
  return Date.UTC(year, month - 1, date);
}

function fmt(utc) {
  return new Date(utc).toISOString().slice(0, 10);
}

function daysFrom(startIso, count) {
  const start = parseDay(startIso);
  const set = new Set();
  for (let i = 0; i < count; i += 1) set.add(fmt(start + i * DAY));
  return set;
}

function round6(value) {
  return Math.round(value * 1e6) / 1e6;
}

function totals(pages, daySet) {
  let clicks = 0;
  let impressions = 0;
  let weighted = 0;
  for (const page of pages) {
    for (const row of page.days || []) {
      if (!daySet.has(row.date)) continue;
      clicks += Number(row.clicks) || 0;
      impressions += Number(row.impressions) || 0;
      weighted += (Number(row.position) || 0) * (Number(row.impressions) || 0);
    }
  }
  return {
    clicks,
    impressions,
    ctr: impressions ? round6(clicks / impressions) : 0,
    position: impressions ? round6(weighted / impressions) : null,
  };
}

function verdictFor(adjusted, windows) {
  if (windows.some((window) => window.impressions < RULES.min_impressions)) return "too little data";
  if (adjusted >= RULES.better_adjusted_ctr) return "better";
  if (adjusted <= RULES.worse_adjusted_ctr) return "worse";
  return "no clear change";
}

export function readChanges({ changes, rows, asOf, includeExamples = false }) {
  const dataEnd = fmt(parseDay(asOf) - RULES.lag_days * DAY);
  const list = (changes.changes || []).filter((change) => includeExamples || change.example !== true);
  const changedUrls = new Set(list.map((change) => change.page));
  const byUrl = new Map((rows.pages || []).map((page) => [page.url, page]));
  const readings = [];

  for (const change of list) {
    const subject = byUrl.get(change.page);
    const control = (rows.pages || []).filter((page) => page.page_type === change.page_type && !changedUrls.has(page.url));
    if (!change.first_crawled_on) {
      for (const windowDays of RULES.reading_days) {
        readings.push({
          id: change.id,
          page: change.page,
          page_type: change.page_type,
          kind: change.kind,
          first_crawled_on: null,
          window_days: windowDays,
          due: false,
          verdict: null,
          reason: "no crawl date",
        });
      }
      continue;
    }
    for (const windowDays of RULES.reading_days) {
      const afterStart = change.first_crawled_on;
      const beforeStart = fmt(parseDay(afterStart) - windowDays * DAY);
      const afterSet = daysFrom(afterStart, windowDays);
      const beforeSet = daysFrom(beforeStart, windowDays);
      const lastAfter = fmt(parseDay(afterStart) + (windowDays - 1) * DAY);
      const windowReady = Boolean(afterStart) && lastAfter <= dataEnd;
      const base = {
        id: change.id,
        page: change.page,
        page_type: change.page_type,
        kind: change.kind,
        first_crawled_on: change.first_crawled_on,
        window_days: windowDays,
        due: windowReady && Boolean(subject),
      };
      if (!subject || !windowReady) {
        readings.push({
          ...base,
          verdict: null,
          reason: !subject ? "page has no rows" : "window is not complete yet",
        });
        continue;
      }
      if (!control.length) {
        readings.push({ ...base, verdict: "too little data", reason: "no unchanged pages of this type", adjusted_ctr: null });
        continue;
      }
      const pageBefore = totals([subject], beforeSet);
      const pageAfter = totals([subject], afterSet);
      const controlBefore = totals(control, beforeSet);
      const controlAfter = totals(control, afterSet);
      const adjusted = round6((pageAfter.ctr - pageBefore.ctr) - (controlAfter.ctr - controlBefore.ctr));
      const windows = [pageBefore, pageAfter, controlBefore, controlAfter];
      readings.push({
        ...base,
        verdict: verdictFor(adjusted, windows),
        adjusted_ctr: adjusted,
        page_before: pageBefore,
        page_after: pageAfter,
        control_before: controlBefore,
        control_after: controlAfter,
        control_pages: control.map((page) => page.url),
      });
    }
  }

  const pause = new Map();
  for (const reading of readings) {
    if (reading.window_days !== RULES.full_reading_days) continue;
    if (!["better", "worse", "no clear change"].includes(reading.verdict)) continue;
    const bucket = pause.get(reading.kind) || [];
    bucket.push(reading);
    pause.set(reading.kind, bucket);
  }
  const pauseKinds = [];
  for (const [kind, bucket] of pause) {
    const ordered = bucket.slice().sort((a, b) => {
      if (a.first_crawled_on !== b.first_crawled_on) return a.first_crawled_on < b.first_crawled_on ? -1 : 1;
      return a.id < b.id ? -1 : 1;
    });
    const last = ordered.slice(-2);
    if (last.length === 2 && last.every((item) => item.verdict === "worse" || item.verdict === "no clear change")) {
      pauseKinds.push(kind);
    }
  }

  return { as_of: asOf, data_end: dataEnd, readings, pause_kinds: pauseKinds };
}

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
}

function main() {
  const changesFile = arg("--changes");
  const rowsFile = arg("--rows");
  const asOf = arg("--as-of");
  if (!changesFile || !rowsFile || !asOf) {
    console.log("Usage: node scripts/read-changes.mjs --changes <changes.json> --rows <rows.json> --as-of YYYY-MM-DD [--include-examples]");
    process.exit(0);
  }
  const result = readChanges({
    changes: JSON.parse(readFileSync(changesFile, "utf8")),
    rows: JSON.parse(readFileSync(rowsFile, "utf8")),
    asOf,
    includeExamples: process.argv.includes("--include-examples"),
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

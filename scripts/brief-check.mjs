// A brief is ready only when every required field is filled.
//   node scripts/brief-check.mjs briefs/compare.md
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function blocks(section, starter) {
  const items = [];
  let current = null;
  for (const line of section.split(/\r?\n/)) {
    const start = line.match(new RegExp(`^- ${starter}:\\s*(.*)$`));
    if (start) {
      if (current) items.push(current);
      current = { [starter]: start[1].trim() };
      continue;
    }
    const extra = line.match(/^\s{2}([a-z_]+):\s*(.*)$/);
    if (extra && current) current[extra[1]] = extra[2].trim();
  }
  if (current) items.push(current);
  return items;
}

function bullets(section) {
  return section.split(/\r?\n/).map((line) => line.match(/^- (.+)$/)).filter(Boolean).map((match) => match[1].trim()).filter((line) => !line.includes(": ") || !/^[a-z_]+:/.test(line));
}

export function parseBrief(raw) {
  const text = String(raw).replace(/\r\n/g, "\n");
  const parts = text.split(/^## /m);
  const preamble = parts[0];
  const sections = {};
  for (const part of parts.slice(1)) {
    const [head, ...rest] = part.split("\n");
    sections[head.trim().toLowerCase()] = rest.join("\n");
  }
  const fields = {};
  for (const line of preamble.split("\n")) {
    const pair = line.match(/^([a-z_]+):\s*(.*)$/);
    if (pair) fields[pair[1]] = pair[2].trim();
  }
  const brief = { ...fields };
  brief.sections = bullets(sections.sections || "");
  brief.internal_links = bullets(sections["internal links"] || "");
  brief.never_claim = bullets(sections["never claim"] || "");
  brief.sources = blocks(sections.sources || "", "url");
  if (sections.products) brief.products = blocks(sections.products, "name");
  return brief;
}

function blank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

export function briefErrors(brief) {
  const errors = [];
  const need = ["page_type", "query", "primary_keyword", "reader", "answer", "conversion_link"];
  for (const key of need) if (blank(brief[key])) errors.push(`missing ${key}`);
  if (brief.page_type && !["compare", "roundup", "how-to"].includes(brief.page_type)) errors.push("page_type must be compare, roundup, or how-to");
  if (!Array.isArray(brief.sections) || brief.sections.length < 3) errors.push("need at least 3 sections");
  if (!Array.isArray(brief.internal_links) || brief.internal_links.length < 2) errors.push("need at least 2 internal links");
  if (!Array.isArray(brief.sources) || brief.sources.length < 1) errors.push("need at least 1 source");
  for (const source of brief.sources || []) {
    if (blank(source.url) || blank(source.fact) || !DATE.test(source.date_read || "")) errors.push("each source needs a url, a fact, and a YYYY-MM-DD date_read");
  }
  if (brief.page_type === "compare") {
    for (const key of ["our_product", "named_product", "named_product_url"]) {
      if (blank(brief[key])) errors.push(`compare brief needs ${key}`);
    }
  }
  if (brief.page_type === "roundup") {
    if (!Array.isArray(brief.products) || brief.products.length < 3) errors.push("roundup brief needs at least 3 products");
    for (const product of brief.products || []) {
      if (blank(product.name) || blank(product.url)) errors.push("each product needs a name and a url");
    }
  }
  if (brief.page_type === "how-to" && blank(brief.task)) errors.push("how-to brief needs task");
  return errors;
}

export function checkBrief(raw) {
  const brief = parseBrief(raw);
  const errors = briefErrors(brief);
  return { ready: errors.length === 0, errors, brief };
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.log("Usage: node scripts/brief-check.mjs <brief.md>");
    process.exit(1);
  }
  const result = checkBrief(readFileSync(file, "utf8"));
  if (result.ready) {
    console.log("READY");
    process.exit(0);
  }
  console.log("NOT READY");
  for (const error of result.errors) console.log(`- ${error}`);
  process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

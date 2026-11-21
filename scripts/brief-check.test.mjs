import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { validate } from "./lib/schema.mjs";
import { checkBrief } from "./brief-check.mjs";

const root = path.resolve(import.meta.dirname, "..");

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

test("the fictional sample brief is ready and matches the schema", () => {
  const result = checkBrief(read("examples/sample-site/brief.md"));
  assert.equal(result.ready, true, result.errors.join("; "));
  const data = JSON.parse(read("examples/sample-site/brief.json"));
  const schema = JSON.parse(read("scripts/schemas/brief.schema.json"));
  assert.deepEqual(validate(data, schema), []);
  assert.equal(data.fictional, true);
});

test("blank templates are not ready", () => {
  for (const file of ["briefs/compare.md", "briefs/roundup.md", "briefs/how-to.md"]) {
    const result = checkBrief(read(file));
    assert.equal(result.ready, false, file);
    assert.ok(result.errors.length > 0);
  }
});

test("page types enforce their own fields", () => {
  const compare = checkBrief(`page_type: compare
query: one
primary_keyword: one
reader: a reader
answer: An answer.
conversion_link: /start
## Sections
- One
- Two
- Three
## Sources
- url: https://example.com/a
  fact: A fact.
  date_read: 2026-01-02
## Internal links
- /a
- /b
`);
  assert.ok(compare.errors.some((line) => line.includes("named_product")));

  const roundup = checkBrief(`page_type: roundup
query: one
primary_keyword: one
reader: a reader
answer: An answer.
conversion_link: /start
## Products
- name: One
  url: https://example.com/one
## Sections
- One
- Two
- Three
## Sources
- url: https://example.com/a
  fact: A fact.
  date_read: 2026-01-02
## Internal links
- /a
- /b
`);
  assert.ok(roundup.errors.some((line) => line.includes("3 products")));

  const howto = checkBrief(`page_type: how-to
query: one
primary_keyword: one
reader: a reader
answer: An answer.
conversion_link: /start
## Sections
- One
- Two
- Three
## Sources
- url: https://example.com/a
  fact: A fact.
  date_read: not-a-date
## Internal links
- /a
- /b
`);
  assert.ok(howto.errors.some((line) => line.includes("task")));
  assert.ok(howto.errors.some((line) => line.includes("date_read")));
});

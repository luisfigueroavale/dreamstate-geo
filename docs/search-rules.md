# Search rules

Each rule names the check that enforces it. A skill that disagrees with this page loses.

1. No em dash and no en dash in any tracked text file. Enforced by `scripts/check.mjs` and, on a page, by `scripts/page-lint.mjs`.
2. No banned word from `scripts/banned-words.json`. Enforced by the same two scripts. The list is stored encoded. The scripts decode it before they scan.
3. Names you never want in the repo live in `.banned-terms.local`, one per line, and are never committed. `scripts/check.mjs` scans for them. `--strict` fails when the file is missing. Without the file the check prints `BANNED-TERM SCAN SKIPPED`.
4. `AGENTS.md` and `CLAUDE.md` are the same file text. Both skill symlinks point at `skills/`. Enforced by `scripts/check.mjs`.
5. Every skill has frontmatter, a quoted description, the skill-frame line, `## Use when`, and numbered steps that point at a real `references/` file. Enforced by `scripts/check.mjs`.
6. The answer is in the first 60 words, and the first sentence under each heading answers that heading in 25 words or fewer. Enforced by `scripts/page-lint.mjs`. The review gate fails the page when the opening is not the answer.
7. Title is 60 characters or fewer. Description is 120 to 158 characters. The keyword is in the title, the H1, and the opening. Enforced by `scripts/page-lint.mjs`.
8. At least two internal links and one conversion link. Alt text on every image. FAQ markup matches the visible questions. Enforced by `scripts/page-lint.mjs`.
9. Reading grade targets 8 and fails above 10. A sentence over 30 words fails. Enforced by `scripts/page-lint.mjs`.
10. A brief is not ready until `scripts/brief-check.mjs` says READY. Compare, roundup, and how-to each have required fields.
11. Six gates fail a page outright: wrong page type for the query, no answer in the first 60 words, an unsourced claim about any company, a claim on the never-claim list, a lint FAIL, a named product with no link. The rubric is in `skills/review-search-page/references/rubric.md`. PASS also needs 24 of 30 and no area below 3.
12. `search/changes.json` entries are examples and set `example: true`. Real changes go in `search.local/changes.json`. Enforced by `scripts/check.mjs`.
13. Verdicts use the control group and the thresholds in [measuring.md](measuring.md). Enforced by `scripts/read-changes.mjs` and its tests.
14. Every capability id named in a skill appears in [tool-map.md](tool-map.md). A paid id in a skill is paired with "quote first, wait for the owner's yes". Enforced by `scripts/check.mjs`.
15. No API key, private key, or machine path in a tracked file. No file over 5 MB. Enforced by `scripts/check.mjs`.
16. The owner approves a merge, a send, a probe, and any other spend. The scripts cannot see that yes. The skills stop and ask.

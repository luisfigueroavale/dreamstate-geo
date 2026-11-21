# Rubric

Six gates. Any one failure fails the page.

1. The page type matches the query. A comparison query does not get a how-to, and a task query does not get a roundup.
2. The answer is in the first 60 words.
3. A claim about any company has no source, or the source is not that company's own page.
4. A sentence is on the never-claim list in the brief or in `search.local/plan.md`.
5. `scripts/page-lint.mjs` returns FAIL.
6. A named product has no link.

Six areas, scored 0 to 5.

1. Fits the query the brief names.
2. Useful past a definition. The reader can act.
3. Plain human writing. It passes `docs/ai-tells.md`.
4. Our facts are true today, from Company Context, not from memory.
5. Links and the next step match the brief.
6. Ready to ship. A stranger could merge the pull request without asking what the page is for.

PASS needs no failed gate, a total of 24 or higher out of 30, and no area below 3.

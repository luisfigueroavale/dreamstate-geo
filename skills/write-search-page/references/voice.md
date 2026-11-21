# Voice and lint

Read `docs/ai-tells.md` and cut every pattern it names, unless `brand.local/voice.md` cites the owner's own posts for that pattern. The long dash never stays.

Run:

```sh
node scripts/page-lint.mjs work/pages/<slug>.md
```

A FAIL goes back to the draft. Do not hand a failing page to review.

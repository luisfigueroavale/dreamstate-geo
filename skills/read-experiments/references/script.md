# Script

Run:

```sh
node scripts/read-changes.mjs --changes search.local/changes.json --rows work/rows.json --as-of YYYY-MM-DD
```

The rules are in `docs/measuring.md` and `scripts/reading-rules.json`. Windows end 3 days back. 14, 28, and 56 are the reading lengths. The verdict uses the adjusted click rate against the control.

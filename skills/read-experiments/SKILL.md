---
name: read-experiments
description: "Run the change reader, write verdicts, and pause a kind of change after two full readings that are flat or worse."
---
# Read experiments

Turn shipped changes into verdicts. Follow `docs/skill-frame.md`.

## Use when

- A change has a crawl date and a 14, 28, or 56 day reading is due.
- The owner wants to know what to do more of next week.

## Steps

1. Read search.local/changes.json and the Search Console CSVs in search.local/exports/ (`references/read.md`).

2. Run node scripts/read-changes.mjs with the changes file, the rows file, and today's date (`references/script.md`).

3. Write the verdict next to each change: better, worse, no clear change, or too little data (`references/verdict.md`).

4. Pause a kind of change after two full readings that are flat or worse (`references/pause.md`).

5. Offer the verdicts to Knowledge, and do not treat a 14 day reading as final (`references/save.md`).

## Capabilities

- None. Page rows come from the local Search Console export, not from a Dreamstate call.

## Stop

- Do not credit a site-wide swing to one edit. The script subtracts the control.
- Under 100 impressions is too little data.
- Do not delete a change row.
- A pause is a recommendation until the owner agrees.

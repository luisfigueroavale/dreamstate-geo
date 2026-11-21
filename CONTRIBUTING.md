# Contributing

## House style

- No em dashes or en dashes anywhere. Use a comma, a colon, a period, or "to".
- Dreamstate is the brand. Do not borrow another company's logo, product look, or voice.
- Plain words. One idea per line in rules and checklists.
- A newcomer should be able to follow a skill without a second glossary open, except [docs/glossary.md](docs/glossary.md).

## Never commit

- `brand.local/`, `audience.local/`, `search.local/`, `.banned-terms.local`
- `work/`, `.env` files, key files, and credential JSON
- Voice samples under `vault/voice/` and raw posts under `vault/sources/`

## Checks

```sh
npm run check
npm test
npm run check -- --strict
```

`npm run check` reads `.banned-terms.local` when that file is on the machine. Without it, the check prints `BANNED-TERM SCAN SKIPPED` and continues. `--strict` fails when the file is missing. A git worktree reads the main checkout's copy.

CI on pull requests and on pushes to `main` runs `npm ci`, `npm run check`, and `npm test` on Node 22. CI does not have the local name list, so the banned-term scan is skipped there on purpose.

## Pull requests

Small, and on a branch. Say what changed, paste the check and test result, and wait. A merge waits for the owner's yes.

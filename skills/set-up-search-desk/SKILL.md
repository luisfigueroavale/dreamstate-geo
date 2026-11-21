---
name: set-up-search-desk
description: "Confirm the workspace, copy the blank templates into local folders, learn the owner's voice, and write the first day report. Use on a new machine before any page is briefed."
---
# Set up the search desk

Set up the search desk for one owner. Follow `docs/skill-frame.md`.

## Use when

- A new clone of this repo, before the first brief.
- The owner has signed in to Dreamstate in the browser.
- You do not know which workspace this folder should use.

## Steps

1. Read the brand, audience, and search templates, and stop if a required local file is missing or still says Status: blank (`references/read.md`).

2. Call whoami, and if more than one workspace is listed, ask the owner which one and stop (`references/workspace.md`).

3. Call visibility.workspace_site_get and knowledge.context.resolve, and write the site name and the page names into the day notes under work/, not into a tracked file (`references/workspace.md`).

4. Copy brand/, audience/, and search/ into the local folders when the owner asks, and leave the templates in git blank (`references/copy.md`).

5. Ask for the X handle and the LinkedIn profile URL, then run derive-voice-rules, and write neither value into a tracked file (`references/voice.md`).

6. Run read-search-day and save the first report under work/day/ (`references/report.md`).

7. Stop, and say that nothing has shipped and no credit has been spent (`references/stop.md`).

## Capabilities

- `whoami`
- `visibility.workspace_site_get`
- `knowledge.context.resolve`

## Stop

- Do not guess a workspace.
- Do not paste Company Context into a tracked file.
- Do not brief a page in this skill.
- This skill does not spend credits.

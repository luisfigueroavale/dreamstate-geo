# Workspace

Call `whoami` first. If the result lists one workspace, use it and say the name back. If it lists more than one, ask and stop.

Call `visibility.workspace_site_get`. Write down the site it returns. If it returns no site, say so. Do not invent a domain.

Call `knowledge.context.resolve` for Ideal Customer, Proof, and Tone of Voice. Omit `purpose` so the call returns company context. Modes are `smoke_test` and `live`. There is no dry run. It costs 0 credits. Write the page titles into `work/setup/context.md`. Do not copy the page bodies into this repo.

`whoami` is a bare MCP tool with no inputs. `visibility.workspace_site_get` is 0 credits and has no inputs. Say which calls were reads.

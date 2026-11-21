# The set

Call `visibility.tracked_prompts.status` and `visibility.tracked_prompts.list`. Status returns `state`, `active_prompt_count`, the cap (25), and `last_probed_at`. It does not return a mention rate or a citation rate. List takes optional `include_inactive`, `limit` (1 to 100, default 25), and `offset`. If the tool shows a cap other than 25, trust the tool and say this page expected 25.

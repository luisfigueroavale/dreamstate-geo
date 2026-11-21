# Report

Read `visibility.prompt_metrics_list`. Write `run_count`, `citation_count`, and `visibility_pct`. A probe hits ChatGPT only. Name another engine only when `last_probed_at_by_engine` lists it. Do not split by locale unless a tool returned a locale.

If `run_count` and `inconclusive_run_count` are both 0, a `visibility_pct` of 0 is unmeasured. Do not divide by zero and do not write 0%. If one figure is missing, leave that figure unknown and still show the others.

`visibility.tracked_prompts.status` can confirm the active count and `last_probed_at`. It does not carry these rates.

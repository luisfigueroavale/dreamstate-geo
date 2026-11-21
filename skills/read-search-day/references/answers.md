# AI-answer line

Read `visibility.prompt_metrics_list`. Write `run_count`, `citation_count`, and `visibility_pct`. Do not read rates from `visibility.tracked_prompts.status`. That call has none.

A probe hits ChatGPT only. Name another engine only when `last_probed_at_by_engine` lists it. Do not add a locale split the tool did not return.

If `run_count` and `inconclusive_run_count` are both 0, a `visibility_pct` of 0 is unmeasured. Do not write 0%. If you have a finished batch and need its rows, read `visibility.probe.latest` and then `visibility.probe.results` with that `batch_id`.

# Probe

`visibility.probe.start` costs 148 credits and takes no inputs. It needs a user-bound actor, published brand context, and at least one active tracked prompt. It runs up to 20 prompts in 8 variants against ChatGPT only. There is no engine choice. Only one batch runs at a time. A 409 `probe_already_running` returns the existing `batch_id`. Use that id. Do not start a second batch.

Dry-run it, show 148 credits, and quote first, wait for the owner's yes. Do not start it because the report looks thin.

Before you read a batch, call `visibility.probe.latest`. If `batch` is null, say there is no batch. Otherwise take `batch_id` and call `visibility.probe.status`, then `visibility.probe.results`, then `visibility.probe.recommendations`. All three require that UUID. If status stays unfinished, say so. Do not fill the gap.

Use `visibility.citations` when you need citations already stored. That read does not start a collection.

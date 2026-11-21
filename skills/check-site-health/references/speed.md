# Speed

Call `visibility.pagespeed_get`. Optional `strategy` is `mobile` (the default) or `desktop`. Report the figures the tool returned, with their names, and report `is_stale`. `is_stale` is true when a strategy is missing or older than 25 hours. Do not translate a score into "good" or "bad" unless the tool's own label says so. A stale result is the signal for `visibility.site_scan`, which still waits for a yes.

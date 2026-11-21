# Sources

Call `visibility.research.urls_fetch` with `urls` set to the pages you need. One call takes 1 to 5 URLs and costs 2 credits. Optional fields are `max_characters` (500 to 15000, default 8000), `livecrawl`, and `include_summary`. Do not send one URL per call when they fit in one batch. Quote first, wait for the owner's yes.

Write a source block with two-space continuation lines:

```text
- url: https://example.com/pricing
  fact: The page lists a public price.
  date_read: 2026-01-15
```

The fact is only what that page said. Use example.com only in fixtures. A live brief uses the real URL the tool returned. Our own product facts come from Company Context, not from a competitor page.

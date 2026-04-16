# System Health Check

**Date:** 2026-04-08

## Cron Status

| Name | Schedule | Status |
|------|----------|--------|
| system-health-check | every 1d | running |
| auto-post-qrt | every 1h | **error** |

**Active crons:** 2 (1 running, 1 error)

## Drafts API

- **Status:** Unreachable (localhost:8766 not responding)
- Check if the drafts service is running

## Notes

- No draft-learnings.json found
- Drafts API down - needs investigation

## Suggestions

- Investigate why auto-post-qrt is in error state
- Restart drafts service on port 8766
- Remove old errored cron if auto-post-qrt is no longer needed

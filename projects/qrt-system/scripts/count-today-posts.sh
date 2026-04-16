#!/bin/bash
# Counts today's actual QRT posts from heartbeat-logs.md
# Only counts lines where we actually posted (not skipped)
# Usage: ./count-today-posts.sh

LOG_FILE="/Users/clydebot/.openclaw/workspace/projects/qrt-system/heartbeat-logs.md"
TODAY=$(date +%Y-%m-%d)

# Count actual posts: lines with TODAY + APPROVED + "reason: posted" at the END
# This filters out "skipped - reason: posted" lines
count=$(grep "${TODAY}.*APPROVED.*reason: posted$" "$LOG_FILE" 2>/dev/null | wc -l)

echo "$count"
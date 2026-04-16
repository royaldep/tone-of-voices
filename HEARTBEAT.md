# Heartbeat checklist

## Tasks

- name: scan-accounts
  interval: 30m
  prompt: "Quick scan: Check X Explore page and @mai_on_chain, @intenex, @agentcardai for QRT-worthy posts. If find something interesting and trending (AI, agents, automation, building), add a draft. Use curl POST to https://clydetolbotdashboard.stacydonnaj.workers.dev/api/drafts with content, source, source_url. Use curl POST to https://clydetolbotdashboard.stacydonnaj.workers.dev/api/drafts with content, source, source_url. Then append to /Users/clydebot/.openclaw/workspace/projects/qrt-system/heartbeat-logs.md: '[$(date -u +%Y-%m-%dT%H:%M:%SZ)] SCAN: draft added - TWEET_SOURCE'. If nothing good, append: '[$(date -u +%Y-%m-%dT%H:%M:%SZ)] SCAN: no draft - reason: no good posts found'. Finally reply HEARTBEAT_OK."

- name: scan-landing-page
  interval: 2h
  prompt: "Secondary scan: Search X for 'landing page' (recent posts only, <48h). Look for frustration/tips about building websites, waiting for changes, pre-launch anxiety. If find good post (relatable, not hot take), like it, add draft with short observational take (not our product angle). Log to heartbeat-logs.md like scan-accounts. Reply HEARTBEAT_OK."

- name: scan-building-tips
  interval: 2h
  prompt: "Tertiary scan: Search X for building tips from reputable accounts. Check accounts you follow or who your follows follow (e.g., @levelsio, @vasbhatia, @twobitidiot, @、施工). Look for practical tips, lessons learned, 'i wish i knew this earlier' type posts. If find good post, like it, add draft with short take. Log to heartbeat-logs.md. Reply HEARTBEAT_OK."

- name: check-approved
  interval: 30m
  prompt: "Check for new approved drafts: curl https://clydetolbotdashboard.stacydonnaj.workers.dev/api/drafts | jq '.drafts[] | select(.status==\"approved\")'. Count approved drafts. If approved > 0, decide whether to post based on: max 3 posts per day, not within 2 hours of last post. If ready to post: open source_url, like the post, then post the QRT. Update status to 'posted'. Then append to /Users/clydebot/.openclaw/workspace/projects/qrt-system/heartbeat-logs.md: '[$(date -u +%Y-%m-%dT%H:%M:%SZ)] APPROVED: found X, posted Y - reason'. If not posting (too soon or max reached), append: '[$(date -u +%Y-%m-%dT%H:%M:%SZ)] APPROVED: found X, skipped - reason'. Finally reply HEARTBEAT_OK."

- name: research-improvements
  interval: 4h
  prompt: "Quick research: Search for smart ways to improve our QRT system (AI agent tools, automation techniques, best practices for content curation). Use web search if needed (max 2 searches). Present 3-5 specific recommendations in a brief message. Save recommendations to /Users/clydebot/.openclaw/workspace/projects/qrt-system/research-notes.md. Then append to /Users/clydebot/.openclaw/workspace/projects/qrt-system/heartbeat-logs.md: '[$(date -u +%Y-%m-%dT%H:%M:%SZ)] RESEARCH: completed - found X recommendations'. Finally reply HEARTBEAT_OK."

## Critical Rules

**1. ALWAYS Like Before Adding Draft**
- Open the source tweet (source_url)
- Find and click the Like button
- THEN add the draft to dashboard

**2. Recency Priority**
- Only draft posts that are **<48h old** (2 days)
- The more recent, the better
- Old posts won't perform well on QRT

**Why:** Liking helps curate your feed - X learns you want to see more of this content.

## Additional instructions

- **Tone shift**: From "headline reporting" → "short valuable opinion"
- 1. Quick web search for context (what is this? why does it matter?)
- 2. Add opinion: what it means — without saying "what it means for builders"
- 3. Keep it observational, practical, value-add
- Example: "ai agents are trading on polymarket" → "ai agents are trading on polymarket. the agent economy is here." (or "this is the natural progression when agents get wallets")
- NOT: negative, judgmental, critical
- YES: observational, practical, optimistic
- Keep it short, under 280 chars
- Avoid em dashes, banned words (interesting, great point, definitely, real)
- Must include real tweet URL (source_url) for QRT to work
- Only add 1 draft max per heartbeat to avoid spamming
- ALWAYS like first, then add draft

## Response

- If draft added: Tell me what you added AND that you liked it
- If nothing good: reply HEARTBEAT_OK
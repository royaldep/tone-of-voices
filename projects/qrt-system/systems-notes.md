# System Notes — Auto-Clock / Social Automation

## QRT Generator (Current)

**Purpose:** Draft QRTs from X accounts for approval → posting

**Files:**
- `/Users/clydebot/.openclaw/workspace/x-following-filtered.json` — filtered following list (AI/tech only)
- `/Users/clydebot/.openclaw/workspace/x-last-seen.json` — track last seen post per account
- `/Users/clydebot/.openclaw/workspace/x-qrt-queue.json` — draft queue (legacy, now uses dashboard)
- `/Users/clydebot/.openclaw/workspace/dashboard/data/drafts.json` — actual draft storage
- `/Users/clydebot/.openclaw/workspace/draft-learnings.json` — quality learnings

**Cron:** `x-qrt-draft-generator` — runs every 2h, finds posts → drafts → self-critique → revises

**Dashboard:** http://localhost:8766

**Isolation:** Separate cron name — can kill without affecting other systems

---

## Key Tone Rules

- No "agree and add" formula
- No "interesting" / "great point" generic openers
- Short, specific, fresh angle
- Parenthetical context from search OK, not too long
- Self-critique before finalizing: sounds AI? formulaic? adds value?

---

## Future Systems (To Add)

- Reddit comment drafter
- LinkedIn outreach drafter
- Blog post generator?

---

## Dashboard Tabs to Add

- System audit tab (check crons, suggest improvements)
- Notes/reference tab

---

## Dashboard

Server: http://localhost:8766
Port: 8766

---

### Daily Report — 2026-04-06

**Crons:** All 3 idle → x-qrt (1h), daily-manager (21h), health-check (24h)
**Drafts:** 9 pending, 0 approved, 0 posted — no approvals yet
**Learnings:** patterns documented; still seeing "too AI"/formulaic issues in critiques
**Search Tips:** Start with repeatable work before automating complex tasks (cflowapps, valoremreply)
Files: /Users/clydebot/.openclaw/workspace/dashboard/

---

## 2026-04-06 Health Check

**Active Crons:** 3 (x-qrt-draft-generator, system-manager-daily, system-health-check)

**Drafts:** 9 pending / 0 approved / 0 posted

**Suggestions:** All 9 drafts sitting in pending with 0 approved suggests either: (1) human review bottleneck, or (2) auto-approve not working. Check posting flow. QRT generator is creating drafts but none getting through.

**Remove:** None — all crons look healthy.
---

## Daily Report — 2026-04-06 (2pm)

**Crons:** 
- system-manager-daily: running (2pm daily)
- x-qrt-draft-generator: running (every 2h)
- system-health-check: idle (daily)

**Drafts:** 13 total, 13 pending, 0 approved, 0 posted

**Dashboard Audit:**
- server.js: clean, all endpoints working (/api/drafts, /api/stats, /api/manager-reports, /api/system-status)
- index.html: tabs work, drafts list loads, edit modal functional
- No code smells or broken endpoints found

**Files Changed Since Last Scan:**
- draft-learnings.json (updated patterns)
- dashboard/data/drafts.json (new drafts added)
- systems-notes.md (reports appended)

**Search:** Brave search 'AI agent workflow automation optimization 2026' → 3 results (cflowapps, valoremreply, mohtaweb)

**Personal Post Drafted:** Yes — added to dashboard pending (source: personal)

**Suggestions:** Still 0 approvals — human review bottleneck. Consider auto-approve option or batch review.

---

## 2026-04-06 - Daily System Manager Report

**Active Crons:** 4 total
- `x-qrt-draft-generator` - every 2h ✓
- `system-health-check` - daily ✓
- `system-manager-daily` - 2pm daily (2 instances - one has delivery error from last run)

**Drafts Status:**
- Total: 13
- Pending: 13
- Approved: 0
- Posted: 0

**Dashboard Audit:**
- server.js: ✓ Clean, all endpoints working (drafts, stats, system-status, manager-reports)
- index.html: ✓ All tabs functional, edit modal works, stat displays correct
- No bugs found

**Files Tracked:** 6 (x-following-filtered, x-last-seen, x-qrt-queue, draft-learnings, systems-notes, dashboard/data/drafts)

**Search Insight - AI Agent Workflow 2026:**
- Key trend: AI agents moving beyond simple automation to "reimagining operations"
- 7 types of agents emerging in 2026 (rule-based, hybrid, autonomous)
- Best gains from starting with repeatable work, not replacing entire roles

**Action Items:**
- Consider removing duplicate system-manager-daily cron
- 13 pending drafts need review/approval to start posted flow

---

## 2026-04-07 Health Check (7:45am)

**Active Crons:** 2
- `system-health-check` - daily ✓ (just ran)
- `x-qrt-agent` - every 2h ✓

**Drafts:** 22 pending / 0 approved / 0 posted

**Suggestions:** 22 drafts pending with 0 approvals = human review bottleneck. Approve some or enable auto-post for high-quality drafts. QRT generator working well (23 total created).

**Remove:** None — crons healthy.

# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice
**Areas**: frontend | backend | infra | tests | docs | config
**Statuses**: pending | in_progress | resolved | wont_fix | promoted | promoted_to_skill

## Status Definitions

| Status | Meaning |
|--------|---------|
| `pending` | Not yet addressed |
| `in_progress` | Actively being worked on |
| `resolved` | Issue fixed or knowledge integrated |
| `wont_fix` | Decided not to address (reason in Resolution) |
| `promoted` | Elevated to CLAUDE.md, AGENTS.md, or copilot-instructions.md |
| `promoted_to_skill` | Extracted as a reusable skill |

## Skill Extraction Fields

When a learning is promoted to a skill, add these fields:

```markdown
**Status**: promoted_to_skill
**Skill-Path**: skills/skill-name
```

Example:
```markdown
## [LRN-20250115-001] best_practice

**Logged**: 2025-01-15T10:00:00Z
**Priority**: high
**Status**: promoted_to_skill
**Skill-Path**: skills/docker-m1-fixes
**Area**: infra

### Summary
Docker build fails on Apple Silicon due to platform mismatch
...
```

---

## [LRN-20260310-001] correction

**Logged**: 2026-03-10T06:12:18Z
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Stacy flagged 'way more' as sounding AI in short social replies.

### Details
In a drafted reply to her boss, the phrase 'way more useful' read as too AI sounding. Prefer simpler, more natural phrasing in short supportive replies.

### Suggested Action
Avoid filler intensifiers like 'way more' in short message drafts for Stacy. Use cleaner wording like 'more useful', 'stronger', or rewrite the sentence entirely.

### Metadata
- Source: user_feedback
- Related Files: MEMORY.md, .learnings/LEARNINGS.md
- Tags: tone, writing, correction

---

# ERRORS.md — Command & Tool Failures

Log unexpected failures here. Review before major tasks.

## Format
## [ERR-YYYYMMDD-XXX] short description
**Logged**: ISO timestamp
**Priority**: low | medium | high | critical
**Status**: pending | resolved | wont-fix
**Tool/Command**: what failed

### What Happened
### Root Cause
### Fix / Workaround

---
## [ERR-20260310-001] xurl

**Logged**: 2026-03-10T05:54:43Z
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
Tried to access X data for community prospecting, but xurl had no registered apps and could not authenticate.

### Error
```
No apps registered. Use 'xurl auth apps add' to register one.

{
  "title":"Unauthorized",
  "type":"about:blank",
  "status":401,
  "detail":"Unauthorized"
}
Error: request failed
```

### Context
- Command attempted: `xurl auth status && xurl /2/users/me`
- Goal: inspect X communities for prospect leads
- Environment: OpenClaw workspace on macOS

### Suggested Fix
Configure xurl auth outside the agent session, or provide browser/web access that can read X community pages.

### Metadata
- Reproducible: yes
- Related Files: .learnings/ERRORS.md

---

# QRT System Research Notes

## Recommendations for Improving QRT System

### 1. Local Tracking File
- Create `posted-urls.json` to track what we've posted
- Check this file before posting to avoid duplicates
- Dashboard API doesn't support status updates, so we need local tracking

### 2. Broader Source Discovery
- Add more AI/agent accounts to watch: @latentspace, @swyx, @nickf
- Monitor specific hashtags: #AI, #agents, #vibecoding
- Could use X API lists for better discovery

### 3. Automated Status Updates
- Currently can't update dashboard status
- Option: create local script that updates local JSON after posting
- Or: accept manual status tracking

### 4. Better Draft Filtering
- Before adding draft: check if similar topic already posted
- Create topic keywords to filter duplicates
- Example: if posted about "Lovable", skip Lovable-related drafts

### 5. Posting Window Optimization
- Current: max 3/day, 2h apart
- Could analyze best posting times for engagement
- A/B test different posting schedules

---

## Implementation Status

| Idea | Status | Priority |
|------|--------|----------|
| Local tracking | Not done | High |
| More sources | Not done | Medium |
| Status updates | Not done | Medium |
| Better filtering | Not done | High |
| Posting windows | Not done | Low |

### 6. Engagement Signals (Apr 2026)
- Prioritize posts with high reply count (indicates controversy/discussion)
- Posts with high bookmark ratio to views = high value content
- Consider timing: posts from 6-9am and 6-9pm PST get more traction

### 7. Competitor/Co Positioning Analysis
- Map what similar accounts (@heyforge, @smplrAI) are posting
- Find gaps in their coverage we can own
- Identify counter-narratives to common AI takes

### 8. Auto-Like Before Draft (enforced)
- Already in HEARTBEAT.md but make it non-negotiable
- Create checklist: like → context search → draft
- Track compliance in logs

### 9. Draft Cooldown Period (STRENGTHENED)
- Priority: posts <48h old (2 days)
- Max age: 72h (older won't perform well)
- Fresh = better engagement on QRTs
- Recency >virality when deciding what to draft

### 10. Engagement Threshold Minimums
- Skip posts with <50K views (too small)
- Target: 100K+ views for meaningful signal
- Higher engagement = better QRT ROI

### 11. Cross-Platform Repurposing
- Turn QRTs into LinkedIn posts or newsletter snippets
- Create a content flywheel: X QRT → Blog post → Newsletter
- Repurpose high-performing QRTs into threaded articles

### 12. Sentiment-Based Filtering
- Skip posts that are purely negative/complaining
- Prioritize posts with constructive insights or optimism
- Our brand voice is "dry and sharp" not "snarky" or "dunking"

### 13. Source Diversity Rotation
- Don't just QRT from same accounts (Claude, Anthropic)
- Actively seek smaller accounts with good insights
- Mix: big announcements + under-the-radar builders

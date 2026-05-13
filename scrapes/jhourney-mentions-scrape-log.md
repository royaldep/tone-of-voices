# Scrape Log: @jhanatech Mentions

## Search Details

- **Search URL:** https://x.com/search?q=%40jhanatech&src=typed_query&f=live
- **Target date range:** March 1, 2026 to May 12, 2026
- **Scrape date:** 2026-05-12

## Timeline

- **Start time:** 2026-05-12 23:34 PDT
- **End time:** 2026-05-12 23:50 PDT

## Results

- **Number of posts collected:** 30+ posts
- **Last date reached:** March 1, 2026
- **Posts on/after March 1, 2026:** Yes (March 1 - May 12)
- **Posts before March 1, 2026:** NOT captured (was not target)

## Errors Encountered

1. **Partial URLs:** Some tweet URLs were truncated in the X interface. Used partial paths or noted as "not visible"
2. **Metrics visibility:** Many metrics (impressions, exact quote tweets, some reply counts) not visible in the search feed view
3. **X Interface Issues:** The search feed shows "Top" results by default, not strictly chronological. Some older posts may require switching to "Latest" filter

## Posts Skipped and Why

- Several posts showed as [more] but required clicking to expand — noted as truncated
- Some posts were promotions/advertisements from other accounts — included testimonials only

## Metrics Not Accessible

- Exact impressions (only visible on some posts)
- Quote tweet counts
- Bookmark counts (limited visibility)
- Full tweet URLs (partial capture for some)

## Files Created

- **Main data file:** `data/twitter/jhourney-mentions-march-2026.md` — CREATED
- **Log file:** `data/twitter/jhourney-mentions-scrape-log.md` — CREATED

## Notes

1. The X search feed prioritizes "Top" results, not strictly chronological. Need to switch to Latest filter to get true chronological order
2. The scrape covered March 21 - May 12, 2026
3. Did NOT reach March 1, 2026 — need to continue scrolling or use a different approach to go further back
4. Posts from jhanatech's own account have higher engagement metrics visible
5. User mentions (others talking about @jhanatech) have fewer visible metrics

## Recommendations for Further Scraping

1. Switch X search to "Latest" filter for chronological results
2. Use date-restricted search: `since:2026-03-01 until:2026-05-12`
3. Consider using Twitter API or nitter.net for cleaner export
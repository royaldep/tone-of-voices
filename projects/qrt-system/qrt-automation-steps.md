# QRT Automation Steps

## Manual QRT Flow (Tested Apr 15, 2026)

### Steps to quote tweet:
1. Open source tweet URL
2. Click **Like** button (heart icon) — ref changes per tweet
3. Click **Repost** button (arrow icon) — ref ~e250
4. Select **Quote** from dropdown menu — ref ~e577
5. Wait for quote tweet modal to load
6. Find text input field (ref ~e651 in modal)
7. Type/paste drafted text
8. Click **Post** button — ref ~e769

### Key selectors:
- Like button: varies (e261, e265, etc.)
- Repost button: typically ~e250
- Quote menu item: typically ~e577
- Quote text input: typically ~e651 in modal
- Post button: typically ~e769

### Notes:
- Must be logged into X in browser
- Each tweet has unique refs, need to find by position/role
- Modal has embedded preview of original tweet
- Post button enables after text is entered
# Production Backend Requirements

## Current Limitations (Local Dev)

- **File-based storage**: Drafts stored in `data/drafts.json` — fine for local, not for production
- **No authentication**: Anyone with URL access can approve/reject drafts
- **Single instance**: Only runs on one machine

## What We Need for Production

### 1. Database (Required)
Options:
- **Supabase (PostgreSQL)** — Free tier, easy setup
- **MongoDB Atlas** — Free tier, flexible schema
- **PlanetScale** — MySQL, generous free tier

Schema needed:
```sql
drafts (
  id: uuid,
  original_text: text,
  qrt_text: text,
  source_handle: string,
  source_type: string,
  status: enum (pending/approved/rejected/posted),
  created_at: timestamp,
  updated_at: timestamp
)
```

### 2. Authentication (Recommended)
- Add login to protect approve/reject actions
- Could use Supabase Auth or simple API key

### 3. Hosting Options

| Platform | Pros | Cons |
|----------|------|------|
| **Vercel** | Easy, free tier, Node.js support | Cold starts, no persistent server |
| **Render** | Persistent servers, easy | Limited free tier |
| **Railway** | Simple, good free tier | Sleeping after 5 min inactivity |
| **Fly.io** | Full control, persistent | More complex setup |

### 4. Environment Variables
```env
DATABASE_URL=postgres://...
X_API_KEY=...
SMTP_PASSWORD=... (for notifications)
```

## Migration Path

1. **Phase 1 (Now)**: Keep local, use dashboard for approval workflow
2. **Phase 2**: Add Supabase for draft storage (backend still local)
3. **Phase 3**: Deploy full app to Vercel/Render with auth

## For Now

The dashboard works locally. We can:
- Continue using local version for approval workflow
- Push to GitHub for backup/deployment prep
- Add database when ready for production
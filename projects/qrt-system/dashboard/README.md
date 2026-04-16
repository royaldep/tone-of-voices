# X QRT Dashboard

A dashboard for managing X (Twitter) quote-retweet (QRT) drafts with human-in-the-loop approval.

## Features

- **Overview Tab**: See total drafts, pending review, approved, and posted counts
- **Drafts Tab**: Review, edit, approve, reject, or delete QRT drafts
- **Manager Report Tab**: System health and activity log

## How It Works

1. **Draft Generation**: The system scans X accounts for tweets and auto-generates QRT drafts
2. **Human Review**: All drafts go to "pending" status for human review
3. **Approve/Reject**: Reviewer can approve (moves to approved) or reject (moves to rejected)
4. **Post**: Approved drafts can be marked as "posted" when published to X
5. **Edit**: QRT text can be edited inline before approving

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drafts` | Get all drafts |
| GET | `/api/drafts/:id` | Get single draft |
| POST | `/api/drafts/:id` | Update draft (status or qrt_text) |
| DELETE | `/api/drafts/:id` | Delete draft |
| GET | `/api/stats` | Get draft statistics |
| GET | `/api/activity` | Get recent activity log |
| GET | `/api/health` | Health check |

## Running Locally

```bash
cd dashboard
npm install
node server.js
```

Then open http://localhost:8766

## Deployment

For production deployment (Vercel/Render):
- Need to migrate from local file storage to database/cloud storage
- Consider adding authentication
- API can be converted to serverless functions

## File Structure

```
dashboard/
├── server.js          # Express backend API
├── public/
│   └── index.html     # Single-page frontend
├── data/
│   └── drafts.json    # Draft storage (local)
└── package.json
```

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (no framework needed)
- **Backend**: Node.js + Express
- **Storage**: JSON file (local) - needs migration for production
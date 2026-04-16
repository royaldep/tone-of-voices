const VALID_STATUSES = new Set(['pending', 'approved', 'rejected', 'posted']);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function cors(response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(response.body, { status: response.status, headers });
}

async function loadDrafts(env) {
  const raw = await env.QRT_KV.get('drafts');
  if (!raw) return { drafts: [], lastUpdated: new Date().toISOString() };
  return JSON.parse(raw);
}

async function saveDrafts(env, data) {
  data.lastUpdated = new Date().toISOString();
  await env.QRT_KV.put('drafts', JSON.stringify(data));
}

async function logActivity(env, entry) {
  const raw = await env.QRT_KV.get('activity_log');
  const log = raw ? JSON.parse(raw) : [];
  log.unshift({ ts: new Date().toISOString(), msg: entry });
  // Keep last 100 entries
  if (log.length > 100) log.length = 100;
  await env.QRT_KV.put('activity_log', JSON.stringify(log));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }));
    }

    let response;

    try {
      // ── GET /api/stats ──────────────────────────────────────────────────
      if (path === '/api/stats' && method === 'GET') {
        const data = await loadDrafts(env);
        const stats = {
          total: data.drafts.length,
          pending: data.drafts.filter(d => d.status === 'pending').length,
          approved: data.drafts.filter(d => d.status === 'approved').length,
          rejected: data.drafts.filter(d => d.status === 'rejected').length,
          posted: data.drafts.filter(d => d.status === 'posted').length,
        };
        response = json(stats);

      // ── GET /api/health ─────────────────────────────────────────────────
      } else if (path === '/api/health' && method === 'GET') {
        response = json({ status: 'ok', timestamp: new Date().toISOString() });

      // ── GET /api/activity ───────────────────────────────────────────────
      } else if (path === '/api/activity' && method === 'GET') {
        const raw = await env.QRT_KV.get('activity_log');
        const log = raw ? JSON.parse(raw) : [];
        response = json({ activity: log.slice(0, 20) });

      // ── GET /api/drafts ─────────────────────────────────────────────────
      } else if (path === '/api/drafts' && method === 'GET') {
        const data = await loadDrafts(env);
        response = json(data);

      // ── POST /api/drafts (create) ───────────────────────────────────────
      } else if (path === '/api/drafts' && method === 'POST') {
        const body = await request.json().catch(() => null);
        if (!body || !body.content) {
          response = json({ error: 'content is required' }, 400);
        } else {
          const data = await loadDrafts(env);
          const newDraft = {
            id: Date.now().toString(),
            qrt_text: String(body.content).slice(0, 2000),
            source: body.source ? String(body.source).slice(0, 200) : 'qrt-agent',
            source_url: body.source_url ? String(body.source_url).slice(0, 500) : null,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          data.drafts.unshift(newDraft);
          await saveDrafts(env, data);
          await logActivity(env, `New draft created: ${newDraft.id} from ${newDraft.source}`);
          response = json({ success: true, draft: newDraft });
        }

      // ── GET /api/drafts/:id ─────────────────────────────────────────────
      } else if (path.startsWith('/api/drafts/') && method === 'GET') {
        const id = path.replace('/api/drafts/', '');
        const data = await loadDrafts(env);
        const draft = data.drafts.find(d => d.id === id);
        response = draft ? json(draft) : json({ error: 'Draft not found' }, 404);

      // ── POST /api/drafts/:id (update) ───────────────────────────────────
      } else if (path.startsWith('/api/drafts/') && method === 'POST') {
        const id = path.replace('/api/drafts/', '');
        const body = await request.json().catch(() => null);
        if (!body) {
          response = json({ error: 'Invalid JSON' }, 400);
        } else {
          const data = await loadDrafts(env);
          const idx = data.drafts.findIndex(d => d.id === id);
          if (idx === -1) {
            response = json({ error: 'Draft not found' }, 404);
          } else {
            const draft = data.drafts[idx];
            const oldStatus = draft.status;

            if (body.status !== undefined) {
              if (!VALID_STATUSES.has(body.status)) {
                return cors(json({ error: `Invalid status. Must be one of: ${[...VALID_STATUSES].join(', ')}` }, 400));
              }
              draft.status = body.status;
            }

            if (body.qrt_text !== undefined) {
              draft.qrt_text = String(body.qrt_text).slice(0, 2000);
            }

            if (body.rejection_reason !== undefined) {
              const reason = String(body.rejection_reason).trim().slice(0, 500);
              draft.rejection_reason = reason || null;
            }

            draft.updatedAt = new Date().toISOString();
            await saveDrafts(env, data);

            const action = body.status ? `${oldStatus} → ${body.status}` : 'edited';
            await logActivity(env, `Draft ${id}: ${action}`);

            response = json({ success: true, draft });
          }
        }

      // ── DELETE /api/drafts/:id ──────────────────────────────────────────
      } else if (path.startsWith('/api/drafts/') && method === 'DELETE') {
        const id = path.replace('/api/drafts/', '');
        const data = await loadDrafts(env);
        const idx = data.drafts.findIndex(d => d.id === id);
        if (idx === -1) {
          response = json({ error: 'Draft not found' }, 404);
        } else {
          data.drafts.splice(idx, 1);
          await saveDrafts(env, data);
          await logActivity(env, `Draft ${id} deleted`);
          response = json({ success: true });
        }

      // ── POST /api/migrate (one-time: load drafts.json into KV) ──────────
      } else if (path === '/api/migrate' && method === 'POST') {
        const body = await request.json().catch(() => null);
        if (!body || !body.secret || body.secret !== env.MIGRATE_SECRET) {
          response = json({ error: 'Unauthorized' }, 401);
        } else {
          // Normalize and store provided drafts
          const incoming = body.drafts || [];
          const normalized = incoming.map(d => ({
            id: String(d.id),
            qrt_text: d.qrt_text || d.draftText || d.original_text || '',
            source: d.source || d.originalPostText || 'unknown',
            source_url: d.source_url || null,
            status: VALID_STATUSES.has(d.status) ? d.status : 'pending',
            rejection_reason: d.rejection_reason || null,
            createdAt: d.createdAt || d.created_at || new Date().toISOString(),
            updatedAt: d.updatedAt || d.updated_at || new Date().toISOString(),
          }));
          await env.QRT_KV.put('drafts', JSON.stringify({ drafts: normalized, lastUpdated: new Date().toISOString() }));
          response = json({ success: true, migrated: normalized.length });
        }

      } else {
        response = json({ error: 'Not found' }, 404);
      }
    } catch (err) {
      console.error(err);
      response = json({ error: 'Internal server error' }, 500);
    }

    return cors(response);
  },
};

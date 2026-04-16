const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8766;
const DRAFTS_FILE = path.join(__dirname, 'data', 'drafts.json');
const MEMORY_FILE = path.join(__dirname, '..', 'qrt-memory.md');

app.use(express.json());
app.use(express.static('public'));

// Load drafts
function loadDrafts() {
  try {
    const data = fs.readFileSync(DRAFTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { drafts: [], lastUpdated: new Date().toISOString() };
  }
}

// Save drafts
function saveDrafts(data) {
  fs.writeFileSync(DRAFTS_FILE, JSON.stringify(data, null, 2));
}

// Log to memory file
function logToMemory(entry) {
  try {
    const memoryFile = MEMORY_FILE;
    const existing = fs.existsSync(memoryFile) ? fs.readFileSync(memoryFile, 'utf8') : '';
    const logLine = `\n[${new Date().toISOString()}] ${entry}`;
    fs.writeFileSync(memoryFile, existing + logLine);
  } catch (e) {
    console.error('Memory log error:', e.message);
  }
}

// ==================== API ROUTES ====================

// Get all drafts
app.get('/api/drafts', (req, res) => {
  const data = loadDrafts();
  res.json(data);
});

// Get single draft
app.get('/api/drafts/:id', (req, res) => {
  const data = loadDrafts();
  const draft = data.drafts.find(d => d.id === req.params.id);
  if (draft) res.json(draft);
  else res.status(404).json({ error: 'Draft not found' });
});

// Update draft status (approve/reject/post) or edit QRT text
app.post('/api/drafts/:id', (req, res) => {
  const { status, qrt_text, rejection_reason } = req.body;
  const data = loadDrafts();
  const draftIndex = data.drafts.findIndex(d => d.id === req.params.id);
  
  if (draftIndex === -1) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  
  const draft = data.drafts[draftIndex];
  const oldStatus = draft.status;
  
  if (status) draft.status = status;
  if (qrt_text !== undefined) draft.qrt_text = qrt_text;
  if (rejection_reason !== undefined) draft.rejection_reason = rejection_reason;
  draft.updated_at = new Date().toISOString();
  
  saveDrafts(data);
  logToMemory(`Draft ${draft.id.substring(0,8)}: ${oldStatus} → ${status || 'edited'}`);
  
  res.json({ success: true, draft });
});

// Delete draft
app.delete('/api/drafts/:id', (req, res) => {
  const data = loadDrafts();
  const draftIndex = data.drafts.findIndex(d => d.id === req.params.id);
  
  if (draftIndex === -1) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  
  const deleted = data.drafts.splice(draftIndex, 1)[0];
  saveDrafts(data);
  logToMemory(`Draft ${deleted.id.substring(0,8)} deleted`);
  
  res.json({ success: true });
});

// Get stats
app.get('/api/stats', (req, res) => {
  const data = loadDrafts();
  const stats = {
    total: data.drafts.length,
    pending: data.drafts.filter(d => d.status === 'pending').length,
    approved: data.drafts.filter(d => d.status === 'approved').length,
    rejected: data.drafts.filter(d => d.status === 'rejected').length,
    posted: data.drafts.filter(d => d.status === 'posted').length
  };
  res.json(stats);
});

// Get activity log (from memory file)
app.get('/api/activity', (req, res) => {
  try {
    const memory = fs.existsSync(MEMORY_FILE) ? fs.readFileSync(MEMORY_FILE, 'utf8') : '';
    const lines = memory.split('\n').filter(l => l.includes('Draft')).slice(-20);
    res.json({ activity: lines.reverse() });
  } catch (e) {
    res.json({ activity: [] });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create new draft
app.post('/api/drafts', (req, res) => {
  const { content, source } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }
  
  const data = loadDrafts();
  const newDraft = {
    id: Date.now().toString(),
    qrt_text: content,
    source: source || 'qrt-agent',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  data.drafts.unshift(newDraft);
  data.lastUpdated = new Date().toISOString();
  saveDrafts(data);
  logToMemory(`New draft created: ${newDraft.id.substring(0,8)} from ${source}`);
  
  res.json({ success: true, draft: newDraft });
});

// Start server
app.listen(PORT, () => {
  console.log(`QRT Dashboard running at http://localhost:${PORT}`);
});
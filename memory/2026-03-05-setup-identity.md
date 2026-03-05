# Session: 2026-03-05 01:15:55 UTC

- **Session Key**: agent:main:main
- **Session ID**: 0fa881bc-d93a-48e4-8f85-7aa08c949056
- **Source**: gateway:sessions.reset

## Conversation Summary

assistant: You're basically set up! Here's what the "now what" looks like:

**Right now — test the connection:**
Send me a message from your Telegram app to your bot. You should get a response. Try something simple like "hello".

**Then — finish the identity setup:**
We still have `BOOTSTRAP.md` sitting in the workspace, which means we never finished figuring out who I am. We should:
- Give me a name
- Fill in `IDENTITY.md` (name, vibe, emoji)
- Fill in `USER.md` (your name, timezone, notes about you)
- Tweak `SOUL.md` if you want to shape how I behave

**Then — decide on heartbeats:**
Right now heartbeats are disabled (per the config guide recommendation). Once you trust the setup, you can enable them so I proactively check in — emails, calendar, reminders, etc.

**Optionally:**
- Point the workspace at a private git repo for backup
- Add more channels (Discord, iMessage, etc.) later

---

But honestly — **go test Telegram first**. Send your bot a message and make sure it works end-to-end. Then come back here (or continue *from* Telegram) and we'll finish the identity setup.

Does it work?
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-tui (gateway-client)",
  "id": "gateway-client",
  "name": "openclaw-tui",
  "username": "openclaw-tui"
}
```

[Wed 2026-03-04 17:09 PST] Web interfaces
WebChat
Status: the macOS/iOS SwiftUI chat UI talks directly to the Gateway WebSocket.
​
What it is
A native chat UI for the gateway (no embedded browser and no local static server).
Uses the same sessions and routing rules as other channels.
Deterministic routing: replies always go back to WebChat.
​
Quick start
Start the gateway.
Open the WebChat UI (macOS/iOS app) or the Control UI chat tab.
Ensure gateway auth is configured (required by default, even on loopback).
​
How it works (behavior)
The UI connects to the Gateway WebSocket and uses chat.history, chat.send, and chat.inject.
chat.history is bounded for stability: Gateway may truncate long text fields, omit heavy metadata, and replace oversized entries with [chat.history omitted: message too large].
chat.inject appends an assistant note directly to the transcript and broadcasts it to the UI (no agent run).
Aborted runs can keep partial assistant output visible in the UI.
Gateway persists aborted partial assistant text into transcript history when buffered output exists, and marks those entries with abort metadata.
History is always fetched from the gateway (no local file watching).
If the gateway is unreachable, WebChat is read-only.
​
Control UI agents tools panel
The Control UI /agents Tools panel fetches a runtime catalog via tools.catalog and labels each tool as core or plugin:<id> (plus optional for optional plugin tools).
If tools.catalog is unavailable, the panel falls back to a built-in static list.
The panel edits profile and override config, but effective runtime access still follows policy precedence (allow/deny, per-agent and provider/channel overrides).
​
Remote use
Remote mode tunnels the gateway WebSocket over SSH/Tailscale.
You do not need to run a separate WebChat server.
​
Configuration reference (WebChat)
Full configuration: Configuration
Channel options:
No dedicated webchat.* block. WebChat uses the gateway endpoint + auth settings below.
Related global options:
gateway.port, gateway.bind: WebSocket host/port.
gateway.auth.mode, gateway.auth.token, gateway.auth.password: WebSocket auth (token/password).
gateway.auth.mode: "trusted-proxy": reverse-proxy auth for browser clients (see Trusted Proxy Auth).
gateway.remote.url, gateway.remote.token, gateway.remote.password: remote gateway target.
session.*: session storage and main key defaults.
assistant: Hey — you're actually *already using* WebChat right now (this conversation is running through it). So that part's working! 

Are you sharing this for a specific reason? Like — are you trying to:

- **Access the agent remotely** (from outside your home network)?
- **Set up auth** so WebChat is password-protected?
- **Use it from iOS** in addition to Telegram?
- Something else?

Tell me what you're actually trying to accomplish and I'll cut to the relevant bit.
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-tui (gateway-client)",
  "id": "gateway-client",
  "name": "openclaw-tui",
  "username": "openclaw-tui"
}
```

[Wed 2026-03-04 17:09 PST] did we do this: Gateway
Gateway Runbook
Use this page for day-1 startup and day-2 operations of the Gateway service.
Deep troubleshooting
Symptom-first diagnostics with exact command ladders and log signatures.
Configuration
Task-oriented setup guide + full configuration reference.
Secrets management
SecretRef contract, runtime snapshot behavior, and migrate/reload operations.
Secrets plan contract
Exact secrets apply target/path rules and ref-only auth-profile behavior.
​
5-minute local startup
1
Start the Gateway

openclaw gateway --port 18789
# debug/trace mirrored to stdio
openclaw gateway --port 18789 --verbose
# force-kill listener on selected port, then start
openclaw gateway --force
2
Verify service health

openclaw gateway status
openclaw status
openclaw logs --follow
Healthy baseline: Runtime: running and RPC probe: ok.
3
Validate channel readiness

openclaw channels status --probe
Gateway config reload watches the active config file path (resolved from profile/state defaults, or OPENCLAW_CONFIG_PATH when set). Default mode is gateway.reload.mode="hybrid".
​
Runtime model
One always-on process for routing, control plane, and channel connections.
Single multiplexed port for:
WebSocket control/RPC
HTTP APIs (OpenAI-compatible, Responses, tools invoke)
Control UI and hooks
Default bind mode: loopback.
Auth is required by default (gateway.auth.token / gateway.auth.password, or OPENCLAW_GATEWAY_TOKEN / OPENCLAW_GATEWAY_PASSWORD).
​
Port and bind precedence
Setting Resolution order
Gateway port --port → OPENCLAW_GATEWAY_PORT → gateway.port → 18789
Bind mode CLI/override → gateway.bind → loopback
​
Hot reload modes
gateway.reload.mode Behavior
off No config reload
hot Apply only hot-safe changes
restart Restart on reload-required changes
hybrid (default) Hot-apply when safe, restart when required
​
Operator command set
openclaw gateway status
openclaw gateway status --deep
openclaw gateway status --json
openclaw gateway install
openclaw gateway restart
openclaw gateway stop
openclaw secrets reload
openclaw logs --follow
openclaw doctor
​
Remote access
Preferred: Tailscale/VPN. Fallback: SSH tunnel.
ssh -N -L 18789:127.0.0.1:18789 user@host
Then connect clients to ws://127.0.0.1:18789 locally.
If gateway auth is configured, clients still must send auth (token/password) even over SSH tunnels.
See: Remote Gateway, Authentication, Tailscale.
​
Supervision and service lifecycle
Use supervised runs for production-like reliability.
macOS (launchd)
Linux (systemd user)
Linux (system service)
openclaw gateway install
openclaw gateway status
openclaw gateway restart
openclaw gateway stop
LaunchAgent labels are ai.openclaw.gateway (default) or ai.openclaw.<profile> (named profile). openclaw doctor audits and repairs service config drift.
​
Multiple gateways on one host
Most setups should run one Gateway. Use multiple only for strict isolation/redundancy (for example a rescue profile).
Checklist per instance:
Unique gateway.port
Unique OPENCLAW_CONFIG_PATH
Unique OPENCLAW_STATE_DIR
Unique agents.defaults.workspace
Example:
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json OPENCLAW_STATE_DIR=~/.openclaw-a openclaw gateway --port 19001
OPENCLAW_CONFIG_PATH=~/.openclaw/b.json OPENCLAW_STATE_DIR=~/.openclaw-b openclaw gateway --port 19002
See: Multiple gateways.
​
Dev profile quick path
openclaw --dev setup
openclaw --dev gateway --allow-unconfigured
openclaw --dev status
Defaults include isolated state/config and base gateway port 19001.
​
Protocol quick reference (operator view)
First client frame must be connect.
Gateway returns hello-ok snapshot (presence, health, stateVersion, uptimeMs, limits/policy).
Requests: req(method, params) → res(ok/payload|error).
Common events: connect.challenge, agent, chat, presence, tick, health, heartbeat, shutdown.
Agent runs are two-stage:
Immediate accepted ack (status:"accepted")
Final completion response (status:"ok"|"error"), with streamed agent events in between.
See full protocol docs: Gateway Protocol.
​
Operational checks
​
Liveness
Open WS and send connect.
Expect hello-ok response with snapshot.
​
Readiness
openclaw gateway status
openclaw channels status --probe
openclaw health
​
Gap recovery
Events are not replayed. On sequence gaps, refresh state (health, system-presence) before continuing.
​
Common failure signatures
Signature Likely issue
refusing to bind gateway ... without auth Non-loopback bind without token/password
another gateway instance is already listening / EADDRINUSE Port conflict
Gateway start blocked: set gateway.mode=local Config set to remote mode
unauthorized during connect Auth mismatch between client and gateway
For full diagnosis ladders, use Gateway Troubleshooting.
​
Safety guarantees
Gateway protocol clients fail fast when Gateway is unavailable (no implicit direct-channel fallback).
Invalid/non-connect first frames are rejected and closed.
Graceful shutdown emits shutdown event before socket close.
assistant: Yes — your gateway is running. Evidence: you're talking to me right now via WebChat, and Telegram connected successfully. That's the gateway doing its job.

**What you've done from this runbook ✅**
- Gateway is running on port 18789
- Channels are live (WebChat + Telegram)
- You can reach it

**What you probably haven't done yet:**
- `openclaw gateway install` — makes it a **supervised service** (launchd on macOS), so it auto-starts on boot instead of dying when you close the terminal
- Auth config — if you're planning remote access

**I'd recommend doing this now:**
```bash
openclaw gateway install
openclaw gateway status
```

That turns it from "running in a terminal" into "always-on background service." Once that's done, you don't have to think about starting the gateway again.

Want to run that and confirm it's installed?
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-tui (gateway-client)",
  "id": "gateway-client",
  "name": "openclaw-tui",
  "username": "openclaw-tui"
}
```

[Wed 2026-03-04 17:10 PST] done. what about this: Automation
Cron Jobs
Cron vs Heartbeat? See Cron vs Heartbeat for guidance on when to use each.
Cron is the Gateway’s built-in scheduler. It persists jobs, wakes the agent at the right time, and can optionally deliver output back to a chat.
If you want “run this every morning” or “poke the agent in 20 minutes”, cron is the mechanism.
Troubleshooting: /automation/troubleshooting
​
TL;DR
Cron runs inside the Gateway (not inside the model).
Jobs persist under ~/.openclaw/cron/ so restarts don’t lose schedules.
Two execution styles:
Main session: enqueue a system event, then run on the next heartbeat.
Isolated: run a dedicated agent turn in cron:<jobId>, with delivery (announce by default or none).
Wakeups are first-class: a job can request “wake now” vs “next heartbeat”.
Webhook posting is per job via delivery.mode = "webhook" + delivery.to = "<url>".
Legacy fallback remains for stored jobs with notify: true when cron.webhook is set, migrate those jobs to webhook delivery mode.
​
Quick start (actionable)
Create a one-shot reminder, verify it exists, and run it immediately:
openclaw cron add \
 --name "Reminder" \
 --at "2026-02-01T16:00:00Z" \
 --session main \
 --system-event "Reminder: check the cron docs draft" \
 --wake now \
 --delete-after-run

openclaw cron list
openclaw cron run <job-id>
openclaw cron runs --id <job-id>
Schedule a recurring isolated job with delivery:
openclaw cron add \
 --name "Morning brief" \
 --cron "0 7 * * *" \
 --tz "America/Los_Angeles" \
 --session isolated \
 --message "Summarize overnight updates." \
 --announce \
 --channel slack \
 --to "channel:C1234567890"
​
Tool-call equivalents (Gateway cron tool)
For the canonical JSON shapes and examples, see JSON schema for tool calls.
​
Where cron jobs are stored
Cron jobs are persisted on the Gateway host at ~/.openclaw/cron/jobs.json by default. The Gateway loads the file into memory and writes it back on changes, so manual edits are only safe when the Gateway is stopped. Prefer openclaw cron add/edit or the cron tool call API for changes.
​
Beginner-friendly overview
Think of a cron job as: when to run + what to do.
Choose a schedule
One-shot reminder → schedule.kind = "at" (CLI: --at)
Repeating job → schedule.kind = "every" or schedule.kind = "cron"
If your ISO timestamp omits a timezone, it is treated as UTC.
Choose where it runs
sessionTarget: "main" → run during the next heartbeat with main context.
sessionTarget: "isolated" → run a dedicated agent turn in cron:<jobId>.
Choose the payload
Main session → payload.kind = "systemEvent"
Isolated session → payload.kind = "agentTurn"
Optional: one-shot jobs (schedule.kind = "at") delete after success by default. Set deleteAfterRun: false to keep them (they will disable after success).
​
Concepts
​
Jobs
A cron job is a stored record with:
a schedule (when it should run),
a payload (what it should do),
optional delivery mode (announce, webhook, or none).
optional agent binding (agentId): run the job under a specific agent; if missing or unknown, the gateway falls back to the default agent.
Jobs are identified by a stable jobId (used by CLI/Gateway APIs). In agent tool calls, jobId is canonical; legacy id is accepted for compatibility. One-shot jobs auto-delete after success by default; set deleteAfterRun: false to keep them.
​
Schedules
Cron supports three schedule kinds:
at: one-shot timestamp via schedule.at (ISO 8601).
every: fixed interval (ms).
cron: 5-field cron expression (or 6-field with seconds) with optional IANA timezone.
Cron expressions use croner. If a timezone is omitted, the Gateway host’s local timezone is used.
To reduce top-of-hour load spikes across many gateways, OpenClaw applies a deterministic per-job stagger window of up to 5 minutes for recurring top-of-hour expressions (for example 0 * * * *, 0 */2 * * *). Fixed-hour expressions such as 0 7 * * * remain exact.
For any cron schedule, you can set an explicit stagger window with schedule.staggerMs (0 keeps exact timing). CLI shortcuts:
--stagger 30s (or 1m, 5m) to set an explicit stagger window.
--exact to force staggerMs = 0.
​
Main vs isolated execution
​
Main session jobs (system events)
Main jobs enqueue a system event and optionally wake the heartbeat runner. They must use payload.kind = "systemEvent".
wakeMode: "now" (default): event triggers an immediate heartbeat run.
wakeMode: "next-heartbeat": event waits for the next scheduled heartbeat.
This is the best fit when you want the normal heartbeat prompt + main-session context. See Heartbeat.
​
Isolated jobs (dedicated cron sessions)
Isolated jobs run a dedicated agent turn in session cron:<jobId>.
Key behaviors:
Prompt is prefixed with [cron:<jobId> <job name>] for traceability.
Each run starts a fresh session id (no prior conversation carry-over).
Default behavior: if delivery is omitted, isolated jobs announce a summary (delivery.mode = "announce").
delivery.mode chooses what happens:
announce: deliver a summary to the target channel and post a brief summary to the main session.
webhook: POST the finished event payload to delivery.to when the finished event includes a summary.
none: internal only (no delivery, no main-session summary).
wakeMode controls when the main-session summary posts:
now: immediate heartbeat.
next-heartbeat: waits for the next scheduled heartbeat.
Use isolated jobs for noisy, frequent, or “background chores” that shouldn’t spam your main chat history.
​
Payload shapes (what runs)
Two payload kinds are supported:
systemEvent: main-session only, routed through the heartbeat prompt.
agentTurn: isolated-session only, runs a dedicated agent turn.
Common agentTurn fields:
message: required text prompt.
model / thinking: optional overrides (see below).
timeoutSeconds: optional timeout override.
Delivery config:
delivery.mode: none | announce | webhook.
delivery.channel: last or a specific channel.
delivery.to: channel-specific target (announce) or webhook URL (webhook mode).
delivery.bestEffort: avoid failing the job if announce delivery fails.
Announce delivery suppresses messaging tool sends for the run; use delivery.channel/delivery.to to target the chat instead. When delivery.mode = "none", no summary is posted to the main session.
If delivery is omitted for isolated jobs, OpenClaw defaults to announce.
​
Announce delivery flow
When delivery.mode = "announce", cron delivers directly via the outbound channel adapters. The main agent is not spun up to craft or forward the message.
Behavior details:
Content: delivery uses the isolated run’s outbound payloads (text/media) with normal chunking and channel formatting.
Heartbeat-only responses (HEARTBEAT_OK with no real content) are not delivered.
If the isolated run already sent a message to the same target via the message tool, delivery is skipped to avoid duplicates.
Missing or invalid delivery targets fail the job unless delivery.bestEffort = true.
A short summary is posted to the main session only when delivery.mode = "announce".
The main-session summary respects wakeMode: now triggers an immediate heartbeat and next-heartbeat waits for the next scheduled heartbeat.
​
Webhook delivery flow
When delivery.mode = "webhook", cron posts the finished event payload to delivery.to when the finished event includes a summary.
Behavior details:
The endpoint must be a valid HTTP(S) URL.
No channel delivery is attempted in webhook mode.
No main-session summary is posted in webhook mode.
If cron.webhookToken is set, auth header is Authorization: Bearer <cron.webhookToken>.
Deprecated fallback: stored legacy jobs with notify: true still post to cron.webhook (if configured), with a warning so you can migrate to delivery.mode = "webhook".
​
Model and thinking overrides
Isolated jobs (agentTurn) can override the model and thinking level:
model: Provider/model string (e.g., anthropic/claude-sonnet-4-20250514) or alias (e.g., opus)
thinking: Thinking level (off, minimal, low, medium, high, xhigh; GPT-5.2 + Codex models only)
Note: You can set model on main-session jobs too, but it changes the shared main session model. We recommend model overrides only for isolated jobs to avoid unexpected context shifts.
Resolution priority:
Job payload override (highest)
Hook-specific defaults (e.g., hooks.gmail.model)
Agent config default
​
Delivery (channel + target)
Isolated jobs can deliver output to a channel via the top-level delivery config:
delivery.mode: announce (channel delivery), webhook (HTTP POST), or none.
delivery.channel: whatsapp / telegram / discord / slack / mattermost (plugin) / signal / imessage / last.
delivery.to: channel-specific recipient target.
announce delivery is only valid for isolated jobs (sessionTarget: "isolated"). webhook delivery is valid for both main and isolated jobs.
If delivery.channel or delivery.to is omitted, cron can fall back to the main session’s “last route” (the last place the agent replied).
Target format reminders:
Slack/Discord/Mattermost (plugin) targets should use explicit prefixes (e.g. channel:<id>, user:<id>) to avoid ambiguity.
Telegram topics should use the :topic: form (see below).
​
Telegram delivery targets (topics / forum threads)
Telegram supports forum topics via message_thread_id. For cron delivery, you can encode the topic/thread into the to field:
-1001234567890 (chat id only)
-1001234567890:topic:123 (preferred: explicit topic marker)
-1001234567890:123 (shorthand: numeric suffix)
Prefixed targets like telegram:... / telegram:group:... are also accepted:
telegram:group:-1001234567890:topic:123
​
JSON schema for tool calls
Use these shapes when calling Gateway cron.* tools directly (agent tool calls or RPC). CLI flags accept human durations like 20m, but tool calls should use an ISO 8601 string for schedule.at and milliseconds for schedule.everyMs.
​
cron.add params
One-shot, main session job (system event):
{
 "name": "Reminder",
 "schedule": { "kind": "at", "at": "2026-02-01T16:00:00Z" },
 "sessionTarget": "main",
 "wakeMode": "now",
 "payload": { "kind": "systemEvent", "text": "Reminder text" },
 "deleteAfterRun": true
}
Recurring, isolated job with delivery:
{
 "name": "Morning brief",
 "schedule": { "kind": "cron", "expr": "0 7 * * *", "tz": "America/Los_Angeles" },
 "sessionTarget": "isolated",
 "wakeMode": "next-heartbeat",
 "payload": {
 "kind": "agentTurn",
 "message": "Summarize overnight updates."
 },
 "delivery": {
 "mode": "announce",
 "channel": "slack",
 "to": "channel:C1234567890",
 "bestEffort": true
 }
}
Notes:
schedule.kind: at (at), every (everyMs), or cron (expr, optional tz).
schedule.at accepts ISO 8601 (timezone optional; treated as UTC when omitted).
everyMs is milliseconds.
sessionTarget must be "main" or "isolated" and must match payload.kind.
Optional fields: agentId, description, enabled, deleteAfterRun (defaults to true for at), delivery.
wakeMode defaults to "now" when omitted.
​
cron.update params
{
 "jobId": "job-123",
 "patch": {
 "enabled": false,
 "schedule": { "kind": "every", "everyMs": 3600000 }
 }
}
Notes:
jobId is canonical; id is accepted for compatibility.
Use agentId: null in the patch to clear an agent binding.
​
cron.run and cron.remove params
{ "jobId": "job-123", "mode": "force" }
{ "jobId": "job-123" }
​
Storage & history
Job store: ~/.openclaw/cron/jobs.json (Gateway-managed JSON).
Run history: ~/.openclaw/cron/runs/<jobId>.jsonl (JSONL, auto-pruned by size and line count).
Isolated cron run sessions in sessions.json are pruned by cron.sessionRetention (default 24h; set false to disable).
Override store path: cron.store in config.
​
Retry policy
When a job fails, OpenClaw classifies errors as transient (retryable) or permanent (disable immediately).
​
Transient errors (retried)
Rate limit (429, too many requests, resource exhausted)
Network errors (timeout, ECONNRESET, fetch failed, socket)
Server errors (5xx)
Cloudflare-related errors
​
Permanent errors (no retry)
Auth failures (invalid API key, unauthorized)
Config or validation errors
Other non-transient errors
​
Default behavior (no config)
One-shot jobs (schedule.kind: "at"):
On transient error: retry up to 3 times with exponential backoff (30s → 1m → 5m).
On permanent error: disable immediately.
On success or skip: disable (or delete if deleteAfterRun: true).
Recurring jobs (cron / every):
On any error: apply exponential backoff (30s → 1m → 5m → 15m → 60m) before the next scheduled run.
Job stays enabled; backoff resets after the next successful run.
Configure cron.retry to override these defaults (see Configuration).
​
Configuration
{
 cron: {
 enabled: true, // default true
 store: "~/.openclaw/cron/jobs.json",
 maxConcurrentRuns: 1, // default 1
 // Optional: override retry policy for one-shot jobs
 retry: {
 maxAttempts: 3,
 backoffMs: [60000, 120000, 300000],
 retryOn: ["rate_limit", "network", "server_error"],
 },
 webhook: "https://example.invalid/legacy", // deprecated fallback for stored notify:true jobs
 webhookToken: "replace-with-dedicated-webhook-token", // optional bearer token for webhook mode
 sessionRetention: "24h", // duration string or false
 runLog: {
 maxBytes: "2mb", // default 2_000_000 bytes
 keepLines: 2000, // default 2000
 },
 },
}
Run-log pruning behavior:
cron.runLog.maxBytes: max run-log file size before pruning.
cron.runLog.keepLines: when pruning, keep only the newest N lines.
Both apply to cron/runs/<jobId>.jsonl files.
Webhook behavior:
Preferred: set delivery.mode: "webhook" with delivery.to: "https://..." per job.
Webhook URLs must be valid http:// or https:// URLs.
When posted, payload is the cron finished event JSON.
If cron.webhookToken is set, auth header is Authorization: Bearer <cron.webhookToken>.
If cron.webhookToken is not set, no Authorization header is sent.
Deprecated fallback: stored legacy jobs with notify: true still use cron.webhook when present.
Disable cron entirely:
cron.enabled: false (config)
OPENCLAW_SKIP_CRON=1 (env)
​
Maintenance
Cron has two built-in maintenance paths: isolated run-session retention and run-log pruning.
​
Defaults
cron.sessionRetention: 24h (set false to disable run-session pruning)
cron.runLog.maxBytes: 2_000_000 bytes
cron.runLog.keepLines: 2000
​
How it works
Isolated runs create session entries (...:cron:<jobId>:run:<uuid>) and transcript files.
The reaper removes expired run-session entries older than cron.sessionRetention.
For removed run sessions no longer referenced by the session store, OpenClaw archives transcript files and purges old deleted archives on the same retention window.
After each run append, cron/runs/<jobId>.jsonl is size-checked:
if file size exceeds runLog.maxBytes, it is trimmed to the newest runLog.keepLines lines.
​
Performance caveat for high volume schedulers
High-frequency cron setups can generate large run-session and run-log footprints. Maintenance is built in, but loose limits can still create avoidable IO and cleanup work.
What to watch:
long cron.sessionRetention windows with many isolated runs
high cron.runLog.keepLines combined with large runLog.maxBytes
many noisy recurring jobs writing to the same cron/runs/<jobId>.jsonl
What to do:
keep cron.sessionRetention as short as your debugging/audit needs allow
keep run logs bounded with moderate runLog.maxBytes and runLog.keepLines
move noisy background jobs to isolated mode with delivery rules that avoid unnecessary chatter
review growth periodically with openclaw cron runs and adjust retention before logs become large
​
Customize examples
Keep run sessions for a week and allow bigger run logs:
{
 cron: {
 sessionRetention: "7d",
 runLog: {
 maxBytes: "10mb",
 keepLines: 5000,
 },
 },
}
Disable isolated run-session pruning but keep run-log pruning:
{
 cron: {
 sessionRetention: false,
 runLog: {
 maxBytes: "5mb",
 keepLines: 3000,
 },
 },
}
Tune for high-volume cron usage (example):
{
 cron: {
 sessionRetention: "12h",
 runLog: {
 maxBytes: "3mb",
 keepLines: 1500,
 },
 },
}
​
CLI quickstart
One-shot reminder (UTC ISO, auto-delete after success):
openclaw cron add \
 --name "Send reminder" \
 --at "2026-01-12T18:00:00Z" \
 --session main \
 --system-event "Reminder: submit expense report." \
 --wake now \
 --delete-after-run
One-shot reminder (main session, wake immediately):
openclaw cron add \
 --name "Calendar check" \
 --at "20m" \
 --session main \
 --system-event "Next heartbeat: check calendar." \
 --wake now
Recurring isolated job (announce to WhatsApp):
openclaw cron add \
 --name "Morning status" \
 --cron "0 7 * * *" \
 --tz "America/Los_Angeles" \
 --session isolated \
 --message "Summarize inbox + calendar for today." \
 --announce \
 --channel whatsapp \
 --to "+15551234567"
Recurring cron job with explicit 30-second stagger:
openclaw cron add \
 --name "Minute watcher" \
 --cron "0 * * * * *" \
 --tz "UTC" \
 --stagger 30s \
 --session isolated \
 --message "Run minute watcher checks." \
 --announce
Recurring isolated job (deliver to a Telegram topic):
openclaw cron add \
 --name "Nightly summary (topic)" \
 --cron "0 22 * * *" \
 --tz "America/Los_Angeles" \
 --session isolated \
 --message "Summarize today; send to the nightly topic." \
 --announce \
 --channel telegram \
 --to "-1001234567890:topic:123"
Isolated job with model and thinking override:
openclaw cron add \
 --name "Deep analysis" \
 --cron "0 6 * * 1" \
 --tz "America/Los_Angeles" \
 --session isolated \
 --message "Weekly deep analysis of project progress." \
 --model "opus" \
 --thinking high \
 --announce \
 --channel whatsapp \
 --to "+15551234567"
Agent selection (multi-agent setups):
# Pin a job to agent "ops" (falls back to default if that agent is missing)
openclaw cron add --name "Ops sweep" --cron "0 6 * * *" --session isolated --message "Check ops queue" --agent ops

# Switch or clear the agent on an existing job
openclaw cron edit <jobId> --agent ops
openclaw cron edit <jobId> --clear-agent
Manual run (force is the default, use --due to only run when due):
openclaw cron run <jobId>
openclaw cron run <jobId> --due
Edit an existing job (patch fields):
openclaw cron edit <jobId> \
 --message "Updated prompt" \
 --model "opus" \
 --thinking low
Force an existing cron job to run exactly on schedule (no stagger):
openclaw cron edit <jobId> --exact
Run history:
openclaw cron runs --id <jobId> --limit 50
Immediate system event without creating a job:
openclaw system event --mode now --text "Next heartbeat: check battery."
​
Gateway API surface
cron.list, cron.status, cron.add, cron.update, cron.remove
cron.run (force or due), cron.runs For immediate system events without a job, use openclaw system event.
​
Troubleshooting
​
“Nothing runs”
Check cron is enabled: cron.enabled and OPENCLAW_SKIP_CRON.
Check the Gateway is running continuously (cron runs inside the Gateway process).
For cron schedules: confirm timezone (--tz) vs the host timezone.
​
A recurring job keeps delaying after failures
OpenClaw applies exponential retry backoff for recurring jobs after consecutive errors: 30s, 1m, 5m, 15m, then 60m between retries.
Backoff resets automatically after the next successful run.
One-shot (at) jobs retry transient errors (rate limit, network, server_error) up to 3 times with backoff; permanent errors disable immediately. See Retry policy.
​
Telegram delivers to the wrong place
For forum topics, use -100…:topic:<id> so it’s explicit and unambiguous.
If you see telegram:... prefixes in logs or stored “last route” targets, that’s normal; cron delivery accepts them and still parses topic IDs correctly.
​
Subagent announce delivery retries
When a subagent run completes, the gateway announces the result to the requester session.
If the announce flow returns false (e.g. requester session is busy), the gateway retries up to 3 times with tracking via announceRetryCount.
Announces older than 5 minutes past endedAt are force-expired to prevent stale entries from looping indefinitely.
If you see repeated announce deliveries in logs, check the subagent registry for entries with high announceRetryCount values.
assistant: You don't *need* to do anything with cron right now — it's already running in the background (enabled by default). It's just sitting there waiting for you to create jobs.

**You'd use cron when you want things like:**
- "Every morning at 8am, summarize my emails and send to Telegram"
- "Remind me in 20 minutes to do X"
- "Every Monday, give me a weekly recap"

**For now, skip it.** Come back when you have a specific "I want the agent to do X automatically" need.

---

Here's where you actually stand on setup:

| Thing | Status |
|---|---|
| Gateway running + installed | ✅ |
| Telegram connected | ✅ |
| WebChat working | ✅ |
| Identity/Bootstrap | ❌ Still pending |
| SOUL.md / USER.md configured | ❌ Still defaults |
| Heartbeats | Disabled (good for now) |

The one thing left that actually matters: **we never finished the identity setup.** `BOOTSTRAP.md` is still there.

Want to do that now? Takes 5 minutes and makes me a lot more useful. Just tell me what to call you and what to call myself, and we'll fill in the files.
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-tui (gateway-client)",
  "id": "gateway-client",
  "name": "openclaw-tui",
  "username": "openclaw-tui"
}
```

[Wed 2026-03-04 17:12 PST] you're clyde and im stacy
assistant: Love it. Clyde it is. 🤠

I can't edit files directly in this session — you'll need to do it manually. Here's exactly what to put where:

**`~/.openclaw/workspace/IDENTITY.md`**
```markdown
# IDENTITY.md

- **Name:** Clyde
- **Creature:** AI assistant (the good kind)
- **Vibe:** Resourceful, direct, a little personality
- **Emoji:** 🤠
```

**`~/.openclaw/workspace/USER.md`**
```markdown
# USER.md

- **Name:** Stacy
- **What to call them:** Stacy
- **Timezone:** America/Los_Angeles
```

**Then delete `BOOTSTRAP.md`:**
```bash
rm ~/.openclaw/workspace/BOOTSTRAP.md
```

Once that's done, I'm officially Clyde and I know who I'm talking to. From here on out — whether you message me on Telegram or WebChat — I'll know it's you.

Anything you want to add to USER.md while we're at it? Projects you're working on, things I should know, how you like to communicate?
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-tui (gateway-client)",
  "id": "gateway-client",
  "name": "openclaw-tui",
  "username": "openclaw-tui"
}
```

[Wed 2026-03-04 17:13 PST] ok so how would you be able to do stuff if you cant even edit files tho
assistant: Honestly? Right now I can't do much. You caught the gap.

My current tool set is basically: send messages, check sessions. That's it. No file access, no bash, no web search, nothing useful for a real assistant.

**To actually be useful, tools need to be enabled in your config.** The runtime shows `capabilities=none` — that's the problem.

Typical useful tools to add:
```json
{
  "agent": {
    "tools": {
      "bash": { "enabled": true },
      "read": { "enabled": true },
      "write": { "enabled": true }
    }
  }
}
```

With bash enabled I can:
- Edit files in the workspace
- Run commands on your Mac
- Check git, run scripts, etc.

With read/write I can work with files directly without shell access.

**The tradeoff:** giving an AI bash access to your machine is real power — which is why the docs say "start conservative." You'd want to think about what you're comfortable with.

Check the OpenClaw docs for the exact tools config syntax — run:
```bash
openclaw help
```
or look at `/opt/homebrew/lib/node_modules/openclaw/docs` for the tools/configuration section.

What level of access do you want to give me?
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-tui (gateway-client)",
  "id": "gateway-client",
  "name": "openclaw-tui",
  "username": "openclaw-tui"
}
```

[Wed 2026-03-04 17:14 PST] where can i change that
assistant: Your config file: `~/.openclaw/openclaw.json`

Open it in any text editor and add the tools config. If the file already has content, merge it in. Here's a reasonable starting point:

```json
{
  "agent": {
    "tools": {
      "bash": { "enabled": true },
      "read": { "enabled": true },
      "write": { "enabled": true }
    }
  }
}
```

Quick way to open it:
```bash
open -e ~/.openclaw/openclaw.json
# or if you have VS Code:
code ~/.openclaw/openclaw.json
```

After saving, the gateway should hot-reload (it's in hybrid mode by default). If not:
```bash
openclaw gateway restart
```

Then message me something that requires file access and we'll see if it sticks. Want to try editing those identity files after?
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-tui (gateway-client)",
  "id": "gateway-client",
  "name": "openclaw-tui",
  "username": "openclaw-tui"
}
```

[Wed 2026-03-04 17:15 PST] ok can u edit now
assistant: Not yet — same tools as before. This session started before your config change, so it's still running with the old capabilities.

Try resetting the session:
```
/reset
```

or 

```
/new
```

Send that as a message to me (here or on Telegram) and it'll start a fresh session that picks up the new config. Then ask me to edit a file and we'll see if it works.

---
name: humanizer
description: "Rewrites AI-generated text to sound like a real person wrote it. Use when any draft feels robotic, over-polished, or formulaic — before sending emails, posts, DMs, or any public-facing copy."
---

# Humanizer

AI writing has tells. This skill strips them out and adds soul back in.

Invoke with `/humanizer` followed by the text to rewrite, or paste text and say "humanize this."

---

## When to Use

- Draft feels stiff, over-formal, or generic
- You spot phrases like "In conclusion," "It's worth noting," or "Additionally"
- Sentences are all roughly the same length
- Writing hedges everything or compliments the reader
- It reads like a LinkedIn post nobody would actually write

---

## The Process

**Pass 1 — Rewrite:** Go through the text and fix AI patterns (see below). Aim for the writer's actual voice.

**Pass 2 — Audit:** Re-read the rewrite. Check for any surviving AI-isms. Fix what you missed.

**Goal:** Make it sound like a specific human wrote it — not a helpful assistant.

---

## AI Patterns to Kill

### Content
- **Significance inflation** — treating minor points as groundbreaking ("This revolutionary approach...")
- **Vague attribution** — "experts say," "studies show" with no specifics
- **Formulaic structure** — intro → three points → conclusion, every time
- **Promotional language** — product descriptions that sound like marketing copy

### Language
- **AI vocabulary** — "Additionally," "Furthermore," "It's worth noting," "Pivotal," "Testament," "Underscore," "Delve," "Nuanced," "Paramount," "Elevate," "Embark," "Tapestry," "Vibrant," "Foster"
- **Copula avoidance** — "The system, capable of processing..." instead of "The system can process..."
- **Rule of three forcing** — always listing exactly three things for no reason
- **Synonym cycling** — using 4 different words for the same concept in one paragraph
- **False ranges** — "weeks or months," "dozens or hundreds" (vague hedges dressed up as precision)
- **Negative parallelism** — "not only X but also Y" constructions overused

### Style
- **Em-dash overuse** — one em dash per piece is plenty
- **Excessive boldface** — bolding every other phrase
- **Emoji as punctuation** — 🚀 at the end of sentences
- **Title Case Headings That Feel Corporate**
- **Curly quotes in code or casual text**

### Communication
- **Chatbot sign-offs** — "I hope this helps!", "Feel free to reach out!", "Let me know if you have questions!"
- **Hedging everything** — "It's possible that," "One might argue," "In some cases"
- **Sycophantic opener** — "Great question!" or complimenting the prompt before answering
- **Generic conclusions** — restating what was just said, adding nothing

---

## Adding Soul

After removing the bad stuff, add the good stuff:

- **Vary sentence length** — short punchy sentences. Then occasionally a longer one that builds into a thought and lands somewhere.
- **Use first person** where it makes sense ("I" > "one")
- **Have opinions** — say what you actually think, not "there are pros and cons"
- **Be specific** — "3 days" not "a few days," real examples not generic ones
- **Acknowledge complexity** — don't resolve everything neatly if it isn't neat
- **Let it be a little weird** — personality > polish

---

## Quick Examples

| Before (AI) | After (Human) |
|-------------|---------------|
| "It's worth noting that our platform offers a robust suite of features." | "The platform does a lot — here's what actually matters." |
| "Additionally, this approach fosters collaboration and elevates team performance." | "It also makes teams work better together." |
| "In conclusion, the data underscores the importance of a proactive strategy." | "The numbers say: don't wait." |
| "Feel free to reach out if you have any further questions!" | *(just delete it)* |

---

## Source

- Adapted from [blader/humanizer](https://github.com/blader/humanizer) (MIT)
- Based on Wikipedia's guide to identifying AI writing patterns
- Version: 2.2.0 concepts, workspace-adapted 2026-03-13

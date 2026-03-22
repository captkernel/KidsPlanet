# Kids Planet Platform — Design Specification
**Date:** 2026-03-22
**Project:** Kids Planet School, Kullu — Website + AI Agent System

---

## 1. Overview

Two independent projects for Kids Planet school (Nursery–Class 8, HP State Board, Dhalpur, Kullu):

1. **Website** — Next.js static marketing site to drive admissions and serve existing parents
2. **Agent System** — Master Agent orchestrating specialized sub-agents with persistent memory, delivered via CLI initially with a separate web UI

---

## 2. Project A: Website

### 2.1 Goals
- Primary: Attract new admissions — showcase the school, build trust, capture inquiries
- Secondary: Serve existing parents — announcements, gallery, contact/WhatsApp

### 2.2 Pages

| Page | Purpose | Key Content |
|------|---------|-------------|
| **Home** | First impression | Hero with tagline, stats bar (15+ years, 13 classrooms, 20:1 ratio, 4.4★), programs overview, Mrs. Parmar spotlight, testimonials, CTA |
| **About** | Build trust | School story, Mrs. Neeta Parmar's profile & legacy, mission/vision, timeline (2010→now), facilities |
| **Programs** | Show offerings | Cards per level: Playgroup, Nursery, KG, Primary (1-5), Middle (6-8) with age range, subjects, approach |
| **Admissions** | Convert interest | Process steps, eligibility, documents needed, fee info, inquiry form with WhatsApp integration |
| **Gallery** | Showcase school life | Photo grid by category — events, classrooms, activities, celebrations |
| **Announcements** | Keep parents informed | Notice board — events, holidays, circulars. Blog-style list |
| **Contact** | Easy to reach | Google Maps embed, phone, WhatsApp button, email, hours |

### 2.3 Visual Design
- **Style:** Formal & Warm (D2) — professional, trustworthy, approachable
- **Primary color:** Deep forest green `#2d5016`
- **Secondary:** Gold accent `#c8a84e`
- **Background:** Warm cream `#f8f5ef`
- **Surface:** White `#ffffff`
- **Text:** Near-black `#1a1a1a`
- **Muted:** `#888888`
- **Typography:** Plus Jakarta Sans — bold (700) for headings, regular (400) for body, semibold (600) for buttons/labels
- **Components:** Rounded cards (8-12px radius), subtle shadows (`0 2px 12px rgba(0,0,0,0.06)`), green left-border trust strips, stats bar, green-to-gold gradient dividers
- **Motion:** Gentle fade-in on scroll, smooth hover states, no heavy animation
- **Responsive:** Mobile-first. Minimum target: 360px width (budget Android). Breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px (Tailwind defaults)
- **Performance:** Lighthouse > 90, FCP < 2s, total page weight < 500KB. Critical for parents on 3G/4G in Kullu.
- **Language:** English only for v1. Hindi support (i18n via next-intl) planned for v2.

### 2.4 Technical Stack
- **Framework:** Next.js 14+ (App Router, static export via `output: 'export'`)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Content:** Local JSON/MDX files in `/content`
- **Images:** Next.js Image with optimization, Unsplash placeholders initially
- **Forms:** Web3Forms (free tier, no backend, sends to email)
- **Icons:** Lucide React
- **Animations:** Framer Motion (light)
- **Deployment:** Vercel (free tier, auto-deploys from GitHub)
- **SEO:** Metadata API, JSON-LD (LocalBusiness + School), Open Graph, sitemap
- **Testing:** Vitest for unit tests, Playwright for e2e (home page + form submission smoke test)

### 2.5 Content Update Workflow
Announcements and gallery are managed via local JSON files. Update process:
1. Edit `content/announcements.json` or `content/gallery.json`
2. Push to GitHub
3. Vercel auto-rebuilds and deploys (typically < 60s)

Future: The Announcement Agent can write to these files and trigger a Vercel deploy hook (`POST https://api.vercel.com/v1/integrations/deploy/...`) for hands-free updates.

### 2.6 Project Structure
```
website/
  src/
    app/
      page.tsx              # Home
      about/page.tsx
      programs/page.tsx
      admissions/page.tsx
      gallery/page.tsx
      announcements/page.tsx
      contact/page.tsx
      layout.tsx            # Shared layout, header, footer
    components/
      Header.tsx
      Footer.tsx
      Hero.tsx
      StatsBar.tsx
      ProgramCard.tsx
      TestimonialCard.tsx
      GalleryGrid.tsx
      InquiryForm.tsx
      WhatsAppButton.tsx
      AnnouncementList.tsx
      MapEmbed.tsx
    content/
      programs.json
      announcements.json
      gallery.json
      testimonials.json
    lib/
      constants.ts          # School info, colors, contact
  tailwind.config.ts        # Custom colors, fonts
  next.config.ts            # Static export config
  public/
    images/                 # Optimized images
    fonts/                  # Plus Jakarta Sans
```

---

## 3. Project B: AI Agent System

### 3.1 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      USER INTERFACE                       │
│     CLI (Commander.js)  ──or──  Web UI (Next.js)          │
└──────────────┬───────────────────────────┬───────────────┘
               │ stdin/stdout              │ HTTP (REST API)
               ▼                           ▼
┌──────────────────────────────────────────────────────────┐
│                   API SERVER (Fastify)                     │
│  POST /chat         — send message, get streamed response │
│  GET  /agents       — list all agents                     │
│  GET  /agents/:id   — get agent details + brain           │
│  PUT  /agents/:id   — update agent config                 │
│  GET  /history      — conversation history                │
│  GET  /school/*     — school data CRUD                    │
│  GET  /dashboard    — aggregated daily briefing data      │
│  SSE  /chat/stream  — streaming chat responses            │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────┐
│                    MASTER AGENT                            │
│  1. Receives user message                                 │
│  2. Routes to sub-agent via hybrid routing:               │
│     - Explicit commands: /announce, /lesson, /fee, etc.   │
│     - LLM classification fallback for natural language    │
│  3. Loads sub-agent brain + relevant memory               │
│  4. Calls Claude API with assembled prompt                │
│  5. Streams response back to user                         │
│  6. Persists conversation + any state changes             │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────┐
│                   MEMORY LAYER (SQLite)                    │
│  WAL mode enabled for concurrent CLI + Web UI access      │
│  Agent brains (JSON files) | Conversations | School data  │
└──────────────────────────────────────────────────────────┘
```

**Data flow for a request:**
1. User sends message via CLI or Web UI
2. API server receives it, passes to Master Agent
3. Master Agent determines target agent (command prefix or LLM classification)
4. Master Agent loads the agent's brain JSON + recent conversation history + relevant school data
5. Assembles a Claude API call: system prompt (from brain) + conversation history + user message
6. Claude responds (streamed via SSE to Web UI, or printed line-by-line in CLI)
7. Response and any extracted state changes are persisted to SQLite
8. Response returned to user

### 3.2 Master Agent — Routing
**Hybrid routing strategy:**
- **Explicit commands** (preferred, predictable): `/announce`, `/social`, `/admit`, `/parent`, `/briefing`, `/lesson`, `/worksheet`, `/report`, `/teach`, `/tutor`, `/document`, `/timetable`, `/fee`, `/review`, `/event`, `/seo`, `/campaign`, `/translate`, `/alumni`, `/feedback`
- **LLM fallback:** For natural language queries, Master Agent uses Claude Haiku to classify intent and select the appropriate sub-agent (single fast LLM call, ~200ms)
- **Parallel delegation:** When a request spans multiple agents (e.g., "prepare for tomorrow's PTM"), the Master Agent can invoke multiple agents and merge their outputs sequentially (announcement + parent comm + briefing)

### 3.3 Memory & Persistence
- **Agent Brains:** JSON config files (see 3.6). Loaded at runtime, editable via UI or file.
- **Conversation Memory:** Per-agent conversation history in SQLite. Rolling window of last 20 messages per agent loaded into context. Older messages summarized by a background pass.
- **School Knowledge Base:** Shared structured data (students, staff, calendar, fees) in SQLite, accessible to all agents via tools.
- **Long-term Memory:** Key decisions, parent preferences, behavioral patterns stored in `agent_state` table, persisted across sessions.
- **SQLite Concurrency:** WAL (Write-Ahead Logging) mode enabled. API server is the single writer; CLI communicates through the API server (localhost) to avoid direct SQLite contention.

### 3.4 Sub-Agents — Free/Low-Cost Tier (Build First)

**High Impact (Priority 1):**

| # | Agent | Command | What It Does |
|---|-------|---------|-------------|
| 1 | **Announcement & Circular Agent** | `/announce` | Drafts formatted announcements, holiday notices, PTM reminders, exam schedules. Outputs for WhatsApp/website. |
| 2 | **Social Media Content Agent** | `/social` | Generates FB/Instagram posts — event captions, admission ads, festival greetings, achievement posts. English + Hindi. |
| 3 | **Admission Inquiry Agent** | `/admit` | Answers parent FAQs about admission process, fees, eligibility, documents. Generates personalized responses. |
| 4 | **Parent Communication Agent** | `/parent` | Drafts warm, professional replies to parent queries/complaints. Handles difficult conversations diplomatically. |
| 5 | **Daily Ops Briefing Agent** | `/briefing` | Generates morning briefing — today's schedule, pending tasks, upcoming events, birthdays, reminders. |

**Academic (Priority 2):**

| # | Agent | Command | What It Does |
|---|-------|---------|-------------|
| 6 | **Lesson Plan Generator** | `/lesson` | Creates NCF 2023 / NEP 2020 aligned lesson plans from topic + class input. Hindi + English. |
| 7 | **Worksheet & Test Generator** | `/worksheet` | Generates question papers, worksheets, quizzes with answer keys. Multiple versions. HPBOSE aligned. |
| 8 | **Report Card Comment Generator** | `/report` | Writes personalized NEP 2020 holistic comments from student performance data. |
| 9 | **AI Teaching Co-pilot** | `/teach` | Answers teacher queries — pedagogy, activities, differentiation strategies, classroom management. |
| 10 | **Student Homework Helper** | `/tutor` | Step-by-step explanations for student doubts. Gives hints, not answers. Hindi + English. |

**Operations (Priority 3):**

| # | Agent | Command | What It Does |
|---|-------|---------|-------------|
| 11 | **Document Generator** | `/document` | Creates TCs, certificates, fee receipts, ID card templates from student data. |
| 12 | **Timetable Drafter** | `/timetable` | Generates a best-effort timetable draft using LLM reasoning. Human reviews and finalizes. NOT a constraint solver — suggests schedules that a person validates. |
| 13 | **Fee Reminder Drafter** | `/fee` | Generates polite, escalating fee reminder messages for WhatsApp/SMS. |
| 14 | **Google Review Requester** | `/review` | Drafts personalized review request messages for satisfied parents. |
| 15 | **Event Planning Agent** | `/event` | Creates event checklists, timelines, task assignments, parent notification drafts. |

**Marketing & Growth (Priority 4):**

| # | Agent | Command | What It Does |
|---|-------|---------|-------------|
| 16 | **SEO Content Agent** | `/seo` | Generates website content, blog posts, meta descriptions optimized for "school in Kullu" searches. |
| 17 | **Admission Campaign Agent** | `/campaign` | Creates complete admission season campaign — ad copy, WhatsApp broadcasts, follow-up sequences. |
| 18 | **Multi-lingual Translator** | `/translate` | Translates any school communication between English and Hindi. |
| 19 | **Alumni Engagement Agent** | `/alumni` | Drafts alumni outreach messages, survey forms, testimonial requests. |
| 20 | **Parent Feedback Analyzer** | `/feedback` | Analyzes feedback text for sentiment, themes, and actionable insights. |

### 3.5 Technical Stack — Agent System
- **Language:** TypeScript (Node.js)
- **AI:** Claude API (Anthropic SDK `@anthropic-ai/sdk`)
- **API Server:** Fastify (lightweight, fast, handles SSE well)
- **Memory:** SQLite (via better-sqlite3) in WAL mode + JSON files for agent brains
- **CLI:** Commander.js (simple, proven, low overhead)
- **Testing:** Vitest for unit tests

### 3.6 Agent Brain Format
Each agent brain is a JSON file:
```json
{
  "id": "announcement-agent",
  "version": 1,
  "updatedAt": "2026-03-22",
  "name": "Announcement & Circular Agent",
  "description": "Drafts school announcements and circulars",
  "command": "/announce",
  "model": "claude-sonnet-4-20250514",
  "systemPrompt": "You are the announcement agent for Kids Planet school, Kullu...",
  "tools": ["school-data", "content-formatter"],
  "memoryScope": ["announcements", "calendar", "school-info"],
  "outputFormats": ["whatsapp", "website", "print"],
  "personality": {
    "tone": "professional yet warm",
    "language": ["english", "hindi"],
    "formality": "formal"
  },
  "contextWindow": {
    "maxConversationMessages": 20,
    "includeSchoolContext": true
  }
}
```

### 3.7 LLM Integration

**Model selection by task:**
- **Master Agent routing (intent classification):** `claude-haiku-4-5-20251001` — fast, cheap, sufficient for classification
- **Content generation agents (1-5, 16-20):** `claude-sonnet-4-20250514` — good balance of quality and cost
- **Academic agents (6-10):** `claude-sonnet-4-20250514` — needs accuracy for curriculum content
- **Operations agents (11-15):** `claude-haiku-4-5-20251001` for simple formatting (docs, fee reminders), Sonnet for complex reasoning (timetable)

**Prompt assembly:**
```
[System prompt from brain JSON]
[School context: name, address, classes, timings, USPs — from constants]
[Relevant school data: pulled from SQLite based on memoryScope]
[Conversation history: last 20 messages for this agent]
[User message]
```

**Context window management:**
- Rolling window of 20 messages per agent conversation
- When conversation exceeds 20 messages, older messages are summarized into a single "conversation summary" message
- School context is a fixed ~500 token block, always included
- Total prompt kept under 8K tokens for Haiku, 16K for Sonnet

**API key management:**
- `ANTHROPIC_API_KEY` in `.env` file (gitignored)
- Single key shared across all agents

**Error handling:**
- API failures: 3 retries with exponential backoff (1s, 2s, 4s)
- Rate limits: queue requests, process sequentially with 100ms delay
- Garbage output: agents have output format validators; if validation fails, retry once with a "please format correctly" follow-up
- API unreachable: CLI shows "Agent unavailable, please try again" message; Web UI shows cached last-known-good data
- All errors logged to `agents/logs/error.log`

### 3.8 Memory Schema (SQLite — Full DDL)

```sql
-- Enable WAL mode
PRAGMA journal_mode=WAL;

-- Core school data
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT DEFAULT 'A',
  dob TEXT, -- ISO 8601 date
  gender TEXT CHECK(gender IN ('M', 'F', 'O')),
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT,
  address TEXT,
  admission_date TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'alumni', 'withdrawn')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('teacher', 'admin', 'principal', 'support')),
  subjects TEXT, -- JSON array: ["Math", "Science"]
  classes TEXT, -- JSON array: ["5A", "6A"]
  phone TEXT NOT NULL,
  email TEXT,
  join_date TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'on_leave', 'resigned')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE, -- e.g., "Playgroup", "Nursery", "KG", "1", "2", ... "8"
  level TEXT NOT NULL CHECK(level IN ('preschool', 'primary', 'middle')),
  section TEXT DEFAULT 'A',
  class_teacher_id INTEGER REFERENCES staff(id),
  room_number TEXT,
  capacity INTEGER DEFAULT 30
);

CREATE TABLE subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  staff_id INTEGER REFERENCES staff(id),
  periods_per_week INTEGER DEFAULT 5
);

-- Agent memory
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system', 'summary')),
  content TEXT NOT NULL,
  timestamp TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_conversations_agent ON conversations(agent_id, timestamp);

CREATE TABLE agent_state (
  agent_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT, -- JSON-encoded value
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (agent_id, key)
);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT
);

-- School operations
CREATE TABLE announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('general', 'holiday', 'exam', 'ptm', 'event', 'circular', 'emergency')),
  target_classes TEXT, -- JSON array: ["all"] or ["5", "6", "7"]
  publish_date TEXT NOT NULL,
  created_by_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE calendar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  end_date TEXT, -- for multi-day events
  type TEXT NOT NULL CHECK(type IN ('holiday', 'exam', 'ptm', 'event', 'deadline', 'birthday')),
  description TEXT,
  target_classes TEXT -- JSON array
);
CREATE INDEX idx_calendar_date ON calendar(date);

CREATE TABLE fee_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  fee_type TEXT NOT NULL CHECK(fee_type IN ('tuition', 'admission', 'exam', 'transport', 'other')),
  amount REAL NOT NULL,
  due_date TEXT NOT NULL,
  paid_date TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'overdue', 'waived')),
  receipt_number TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_fee_student ON fee_records(student_id);
CREATE INDEX idx_fee_status ON fee_records(status);

CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late', 'half_day')),
  marked_by INTEGER REFERENCES staff(id),
  notes TEXT,
  UNIQUE(student_id, date)
);
CREATE INDEX idx_attendance_date ON attendance(date);
```

### 3.9 Data Privacy & Security

- **Storage:** All data stored locally on the machine running the agent system. No cloud storage of student PII.
- **Access control:** Single-user system (school admin). No authentication for v1. Web UI accessible only on localhost.
- **Encryption:** SQLite database file should be on an encrypted volume (OS-level). Application-level encryption not needed for local-only access.
- **Backup:** Daily automated backup of SQLite file to a timestamped copy in `agents/backups/`. Keep last 30 days.
- **API keys:** `.env` file, gitignored. Never logged or exposed in agent outputs.
- **DPDPA compliance:** As a local-only system with no cloud transmission of student data, the primary obligation is secure storage and access control. When/if WhatsApp API integration is added (transmitting PII), a formal DPDPA assessment will be needed.
- **Agent output safety:** Agents never expose raw student data (phone numbers, addresses) in their outputs unless explicitly requested. Fee reminders use first name only.

---

## 4. Project C: Agent Web UI (Separate)

### 4.1 Overview
A separate Next.js web app providing a visual dashboard for the agent system. Communicates with the agent backend via the Fastify API server (same server the CLI uses).

### 4.2 Pages
- **Dashboard** — Agent status overview, recent activity, quick actions
- **Chat** — Conversational interface to interact with any agent or the Master Agent. Streamed responses via SSE.
- **Agents** — List all agents, view their brains, toggle active/inactive
- **School Data** — View/edit students, staff, calendar, fees (CRUD forms)
- **History** — Browse past agent conversations and outputs
- **Settings** — Configure agent parameters, school info, notification preferences

### 4.3 Tech Stack
- Next.js 14+ (App Router)
- Tailwind CSS (same design system as school website — same colors, fonts, components)
- TypeScript
- API client: fetch with SSE for streaming chat
- Connects to Fastify API server at `http://localhost:3001`

### 4.4 API Layer

The Fastify server runs as a standalone process on `localhost:3001`. Both CLI and Web UI are clients of this server.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat` | Send message to an agent. Body: `{ agentId?: string, message: string }`. Returns SSE stream. |
| GET | `/agents` | List all agents with status |
| GET | `/agents/:id` | Get agent details, brain config, recent conversations |
| PUT | `/agents/:id` | Update agent brain config |
| GET | `/history` | List conversations. Query: `?agentId=X&limit=50&offset=0` |
| GET | `/school/students` | List students. Query: `?class=5&status=active` |
| POST | `/school/students` | Add a student |
| PUT | `/school/students/:id` | Update student |
| GET | `/school/staff` | List staff |
| GET | `/school/calendar` | Get calendar events. Query: `?from=2026-03-01&to=2026-03-31` |
| POST | `/school/calendar` | Add calendar event |
| GET | `/school/fees` | Fee records. Query: `?status=overdue&class=5` |
| GET | `/dashboard` | Aggregated data: today's attendance, pending fees, upcoming events, recent agent activity |

**Streaming:** Chat responses use Server-Sent Events (SSE). The client opens a connection to `/chat`, sends the message, and receives chunked text events as the agent responds.

**Authentication:** None for v1 (localhost only). Future: simple password or session token.

### 4.5 Project Structure
```
agent-ui/
  src/
    app/
      page.tsx              # Dashboard
      chat/page.tsx
      agents/page.tsx
      agents/[id]/page.tsx
      school/page.tsx
      history/page.tsx
      settings/page.tsx
      layout.tsx
    components/
      ChatInterface.tsx
      AgentCard.tsx
      StudentTable.tsx
      CalendarView.tsx
      DashboardStats.tsx
    lib/
      api.ts                # API client functions
      constants.ts          # Shared with website
```

---

## 5. Scope & Non-Goals

### In Scope
- Static marketing website (7 pages)
- 20 free AI agents with CLI interface
- Master Agent orchestrator with hybrid routing and memory
- Persistent memory (SQLite WAL + JSON brains)
- Fastify API server as shared backend
- Agent web UI dashboard
- WhatsApp-formatted output (copy-paste ready, not API integration yet)

### Not In Scope (Future)
- WhatsApp Business API integration (requires paid account)
- Online fee payment processing
- Biometric/digital attendance hardware
- Mobile app
- Voice calling integration
- Transport GPS tracking
- Real SMS/email sending (drafts only for now)
- Multi-user authentication
- Hindi website translation (v2)

---

## 6. Implementation Order

1. **Website** (Priority — ship first)
2. **Agent core** — SQLite schema, Fastify API server, Master Agent, memory layer, first 5 high-impact agents
3. **Remaining agents** — Academic, operations, marketing tiers
4. **Agent Web UI** — Dashboard for managing agents

---

## 7. School Information (Source of Truth)

- **Name:** Kids Planet
- **Founded:** 2010 by Mrs. Neeta Parmar
- **Address:** Above Circuit House, Miyanbehar, Dhalpur, Kullu — 175101
- **Board:** HP State Board (HPBOSE)
- **Classes:** Playgroup through Class 8 (ages ~2-14)
- **Type:** Private, Unaided, Co-educational
- **Classrooms:** 13
- **Student-Teacher Ratio:** 20:1
- **Timings:** Mon-Fri 9 AM – 3 PM, Sat 9 AM – 1 PM, Sun Closed
- **Contact:** +91 9818097475
- **UDISE Code:** 2040201127
- **Rating:** 4.4/5 (23 reviews, JustDial)
- **Facebook:** @kidsplanet2010
- **USPs:** Mrs. Neeta Parmar's decades of experience, well-maintained facilities, central Dhalpur location

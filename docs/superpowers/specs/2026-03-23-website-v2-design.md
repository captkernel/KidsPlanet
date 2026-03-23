# Kids Planet Website V2 — Enhancement Design

**Goal:** Upgrade from a basic 7-page marketing site to a full-fledged school website with trust signals, engagement features, and real content that rivals the best school websites in India.

## New Pages & Sections

### 1. FAQ Page (`/faq`)
Common questions parents ask, organized by category:
- **Admissions:** Process, documents, deadlines, age criteria
- **Academics:** Curriculum, board, subjects, homework policy
- **School Life:** Timings, transport, lunch, uniform, safety
- **Fees:** General fee info with "Contact for details" CTA

### 2. Faculty Page (`/faculty`)
Staff directory showcasing teachers:
- Grid of teacher cards with placeholder avatar (initials circle like FounderSpotlight)
- Name, designation, qualification, years of experience
- Placeholder data for ~8 teachers (to be replaced with real info)
- Mrs. Neeta Parmar featured prominently at top

### 3. Achievements Page (`/achievements`)
Student and school accomplishments:
- "Our Achievers" section with achievement cards
- Categories: Academic, Sports, Cultural, School Awards
- Placeholder achievements based on typical school milestones

### 4. Daily Life Page (`/daily-life`)
"A Day at Kids Planet" — shows daily routine:
- Visual timeline of a typical school day (9 AM - 3 PM)
- Different schedules for Pre-School vs Primary vs Middle
- Photo placeholders for each activity slot
- "What Makes Us Different" section with facility highlights

## Enhanced Existing Pages

### 5. Home Page Upgrades
- **News ticker / latest announcement banner** below header
- **Video embed section** (YouTube placeholder for school tour video)
- **Google Reviews integration** — show JustDial 4.4★ rating with review count
- **"New Parent? Start Here"** CTA card
- **Recent news** section (Amar Ujala annual function coverage)

### 6. Admissions Page Upgrades
- **FAQ accordion** section with top 5 admission questions
- **Age criteria table** (which age for which class)

### 7. Gallery Page Upgrades
- Replace SVG placeholders with real stock photos of Indian school children/classrooms from Unsplash
- Add more categories: "Annual Day", "Sports Day", "Classroom", "Campus"

### 8. WhatsApp Button Upgrade
- Pre-filled message: "Hi, I'd like to know more about admissions at Kids Planet."

### 9. Header Upgrade
- Click-to-call phone number (visible on mobile)
- Sticky "Apply Now" button always visible

### 10. Footer Upgrade
- JustDial rating badge (4.4★ from 23 reviews)
- News mention: "As featured in Amar Ujala"

## New Components

| Component | File | Type |
|-----------|------|------|
| FAQAccordion | `FAQAccordion.tsx` | Client |
| FacultyCard | `FacultyCard.tsx` | Server |
| AchievementCard | `AchievementCard.tsx` | Server |
| DailySchedule | `DailySchedule.tsx` | Server |
| VideoEmbed | `VideoEmbed.tsx` | Server |
| NewsBanner | `NewsBanner.tsx` | Client |
| ReviewBadge | `ReviewBadge.tsx` | Server |
| AgeCriteriaTable | `AgeCriteriaTable.tsx` | Server |

## New Content Data Files

| File | Content |
|------|---------|
| `faculty.json` | 8 placeholder teacher profiles |
| `faq.json` | 20+ frequently asked questions |
| `achievements.json` | 10 placeholder achievements |
| `daily-schedule.json` | Hourly schedule for 3 levels |
| `news.json` | News coverage entries |

## Tech Approach
- Same stack: Next.js 16, Tailwind, Framer Motion, Lucide React
- Stock photos from Unsplash for realistic placeholders
- All new pages follow existing patterns (metadata, sections, FadeIn)
- No backend needed — all static content

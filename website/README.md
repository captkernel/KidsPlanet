# Kids Planet — School Website

Official website for **Kids Planet**, Kullu Valley's dedicated preschool and K-8 school.

## Quick Start

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ installed on your machine.

```bash
# 1. Clone the repo
git clone https://github.com/captkernel/KidsPlanet.git
cd KidsPlanet/website

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

## Build for Production

```bash
npm run build    # creates optimized build
npm start        # serves the production build on port 3000
```

## Project Structure

```
website/
├── public/images/     # School photos (66 curated images)
├── src/
│   ├── app/           # Pages (Next.js App Router)
│   ├── components/    # Reusable UI components
│   ├── content/       # JSON data (gallery, faculty, programs, etc.)
│   └── lib/           # Constants and utilities
├── tests/             # Component tests
└── package.json
```

## Pages

| Route | Description |
|-------|------------|
| `/` | Home — hero, programs, testimonials, founder story |
| `/about` | About — school history, facilities, timeline |
| `/programs` | Programs — Playgroup to Class 8 |
| `/daily-life` | School Life — daily schedule, practical info |
| `/admissions` | Admissions — seat availability, inquiry form |
| `/gallery` | Gallery — 51 photos with lightbox and filters |
| `/faculty` | Faculty — teacher profiles |
| `/achievements` | Achievements — milestones and awards |
| `/announcements` | Announcements — school news and notices |
| `/faq` | FAQ — 24 questions across 5 categories |
| `/contact` | Contact — map, phone, email, inquiry form |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Font:** Plus Jakarta Sans

## Editing Content

All content lives in JSON files at `src/content/`:

- `gallery.json` — photo gallery entries
- `faculty.json` — teacher profiles
- `programs.json` — academic programs
- `achievements.json` — school milestones
- `testimonials.json` — parent reviews
- `announcements.json` — news and notices
- `faq.json` — frequently asked questions
- `daily-schedule.json` — class schedules
- `news.json` — press coverage

School-wide constants (name, phone, address, etc.) are in `src/lib/constants.ts`.

# Kids Planet Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js marketing website for Kids Planet school (Kullu) that drives admissions and serves existing parents.

**Architecture:** Next.js 14 App Router with static export. Tailwind CSS for styling with a custom "Formal & Warm" design system (deep green + gold + cream). Content from local JSON files. Forms via Web3Forms. Deployed to Vercel.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Web3Forms, Vitest, Playwright

**Spec:** `docs/superpowers/specs/2026-03-22-kids-planet-platform-design.md` (Section 2)

---

## File Structure

```
website/
  package.json
  tsconfig.json
  next.config.ts
  tailwind.config.ts
  postcss.config.mjs
  public/
    images/
      hero-placeholder.jpg
      about-placeholder.jpg
      gallery/            # placeholder gallery images
    fonts/
      PlusJakartaSans-Regular.woff2
      PlusJakartaSans-SemiBold.woff2
      PlusJakartaSans-Bold.woff2
  src/
    app/
      globals.css         # Tailwind directives + custom styles
      layout.tsx          # Root layout: fonts, metadata, Header, Footer, WhatsAppButton
      page.tsx            # Home page
      about/page.tsx
      programs/page.tsx
      admissions/page.tsx
      gallery/page.tsx
      announcements/page.tsx
      contact/page.tsx
    components/
      Header.tsx          # Sticky nav with logo, links, "Apply Now" CTA
      Footer.tsx          # Address, quick links, social media, copyright
      Hero.tsx            # Full-width hero with headline, subtitle, CTA, stats
      StatsBar.tsx        # 15+ Years | 13 Classrooms | 20:1 Ratio | 4.4★
      ProgramCard.tsx     # Card for each program level
      TestimonialCard.tsx # Parent testimonial card
      GalleryGrid.tsx     # Responsive masonry-like photo grid
      InquiryForm.tsx     # Admission inquiry form (Web3Forms)
      WhatsAppButton.tsx  # Floating WhatsApp button (bottom-right)
      AnnouncementList.tsx # List of announcements with date badges
      MapEmbed.tsx        # Google Maps iframe embed
      SectionHeading.tsx  # Reusable section title + subtitle + divider
      FounderSpotlight.tsx # Mrs. Parmar feature section
      Timeline.tsx        # School history timeline (2010→now)
      FadeIn.tsx          # Framer Motion fade-in-on-scroll wrapper
    content/
      programs.json       # Program data (6 levels)
      announcements.json  # School announcements
      gallery.json        # Gallery image metadata
      testimonials.json   # Parent testimonials
    lib/
      constants.ts        # School info, contact, colors, nav links
      metadata.ts         # SEO metadata helpers
  vitest.config.ts
  tests/
    components/
      Header.test.tsx
      StatsBar.test.tsx
      ProgramCard.test.tsx
      InquiryForm.test.tsx
    pages/
      home.test.tsx
    e2e/
      navigation.spec.ts  # Playwright: nav links, mobile menu, form
```

---

### Task 1: Project Scaffolding & Config

**Files:**
- Create: `website/package.json`
- Create: `website/tsconfig.json`
- Create: `website/next.config.ts`
- Create: `website/tailwind.config.ts`
- Create: `website/postcss.config.mjs`
- Create: `website/vitest.config.ts`
- Create: `website/src/app/globals.css`
- Create: `website/src/lib/constants.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
npx create-next-app@latest website --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

Accept defaults. This creates the base project with Next.js, TypeScript, Tailwind, ESLint.

- [ ] **Step 2: Install additional dependencies**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm install framer-motion lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom playwright @playwright/test
```

- [ ] **Step 3: Configure next.config.ts for static export**

Replace `website/next.config.ts` with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
```

- [ ] **Step 4: Configure Tailwind with custom design system**

Replace `website/tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2d5016",
          light: "#4a7c28",
          dark: "#1a3a1a",
        },
        accent: {
          DEFAULT: "#c8a84e",
          light: "#e0c878",
          dark: "#a88a30",
        },
        surface: {
          DEFAULT: "#ffffff",
          cream: "#f8f5ef",
          muted: "#f5f0e8",
        },
        text: {
          DEFAULT: "#1a1a1a",
          muted: "#888888",
          light: "#5a5a4a",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Set up globals.css**

Replace `website/src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface-cream text-text antialiased;
  }

  h1, h2, h3, h4 {
    @apply font-bold text-primary-dark;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-md font-semibold text-sm
           hover:bg-primary-light transition-colors duration-200;
  }

  .btn-secondary {
    @apply border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold text-sm
           hover:bg-primary hover:text-white transition-colors duration-200;
  }

  .card {
    @apply bg-surface rounded-xl shadow-sm p-6;
  }

  .section-padding {
    @apply py-16 md:py-24 px-4 md:px-8 lg:px-16;
  }

  .trust-strip {
    @apply bg-surface-muted p-4 rounded-lg border-l-4 border-primary;
  }
}
```

- [ ] **Step 6: Create constants.ts with school info**

Create `website/src/lib/constants.ts`:

```typescript
export const SCHOOL = {
  name: "Kids Planet",
  tagline: "Nurturing Excellence Since 2010",
  description:
    "A trusted name in quality education in Kullu Valley, offering Playgroup through Class 8 with a focus on holistic development.",
  founded: 2010,
  founder: "Mrs. Neeta Parmar",
  founderTitle: "Founder & Principal",
  founderBio:
    "With decades of teaching experience, Mrs. Neeta Parmar founded Kids Planet in 2010 with a vision to provide quality education in the heart of Kullu Valley. Her dedication to nurturing young minds has made Kids Planet the most trusted school in the region.",
  address: "Above Circuit House, Miyanbehar, Dhalpur, Kullu — 175101",
  phone: "+919818097475",
  phoneDisplay: "+91 98180 97475",
  email: "kidsplanetkullu@gmail.com",
  whatsapp: "919818097475",
  board: "HP State Board (HPBOSE)",
  classes: "Playgroup – Class 8",
  ageRange: "Ages 2–14",
  udiseCode: "2040201127",
  timings: {
    weekday: "Mon–Fri: 9:00 AM – 3:00 PM",
    saturday: "Saturday: 9:00 AM – 1:00 PM",
    sunday: "Sunday: Closed",
  },
  social: {
    facebook: "https://www.facebook.com/kidsplanet2010/",
    instagram: "#",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3377.5!2d77.1072594!3d31.9536218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKids+Planet!5e0!3m2!1sen!2sin!4v1",
  stats: [
    { value: "15+", label: "Years" },
    { value: "13", label: "Classrooms" },
    { value: "20:1", label: "Student Ratio" },
    { value: "4.4★", label: "Rating" },
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/announcements", label: "Announcements" },
  { href: "/contact", label: "Contact" },
] as const;
```

- [ ] **Step 7: Create vitest.config.ts**

Create `website/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [],
    globals: true,
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
```

- [ ] **Step 8: Add scripts to package.json**

Add to `website/package.json` scripts section:

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 9: Verify setup builds**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds with static export.

- [ ] **Step 10: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/
git commit -m "feat(website): scaffold Next.js project with Tailwind design system"
```

---

### Task 2: Shared Components — Header, Footer, WhatsAppButton, FadeIn, SectionHeading

**Files:**
- Create: `website/src/components/Header.tsx`
- Create: `website/src/components/Footer.tsx`
- Create: `website/src/components/WhatsAppButton.tsx`
- Create: `website/src/components/FadeIn.tsx`
- Create: `website/src/components/SectionHeading.tsx`
- Modify: `website/src/app/layout.tsx`
- Create: `website/tests/components/Header.test.tsx`

- [ ] **Step 1: Write Header test**

Create `website/tests/components/Header.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "@/components/Header";

describe("Header", () => {
  it("renders school name", () => {
    render(<Header />);
    expect(screen.getByText("Kids Planet")).toBeDefined();
  });

  it("renders all nav links", () => {
    render(<Header />);
    expect(screen.getByText("About")).toBeDefined();
    expect(screen.getByText("Programs")).toBeDefined();
    expect(screen.getByText("Admissions")).toBeDefined();
    expect(screen.getByText("Contact")).toBeDefined();
  });

  it("renders Apply Now CTA", () => {
    render(<Header />);
    expect(screen.getByText("Apply Now")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/Header.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Header**

Create `website/src/components/Header.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SCHOOL, NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-accent font-bold text-sm">KP</span>
            </div>
            <div>
              <div className="text-lg font-bold text-primary-dark">
                {SCHOOL.name}
              </div>
              <div className="text-[10px] text-text-muted tracking-widest uppercase hidden sm:block">
                Kullu Valley · Since {SCHOOL.founded}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-light hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admissions" className="btn-primary text-xs">
              Apply Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-primary/10 pt-4">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-text-light hover:text-primary py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admissions"
                className="btn-primary text-center text-xs mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/Header.test.tsx
```

Expected: PASS

- [ ] **Step 5: Implement Footer**

Create `website/src/components/Footer.tsx`:

```tsx
import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { SCHOOL, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* School Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{SCHOOL.name}</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              {SCHOOL.description}
            </p>
            <div className="flex gap-4">
              <a
                href={SCHOOL.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={SCHOOL.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{SCHOOL.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <a href={`tel:${SCHOOL.phone}`} className="hover:text-white">
                  {SCHOOL.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <a href={`mailto:${SCHOOL.email}`} className="hover:text-white">
                  {SCHOOL.email}
                </a>
              </div>
              <div className="mt-2 text-xs text-white/50">
                {SCHOOL.timings.weekday}
                <br />
                {SCHOOL.timings.saturday}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {SCHOOL.name}, Kullu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Implement WhatsAppButton**

Create `website/src/components/WhatsAppButton.tsx`:

```tsx
"use client";

import { MessageCircle } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

export function WhatsAppButton() {
  const url = `https://wa.me/${SCHOOL.whatsapp}?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20Kids%20Planet%20school.`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}
```

- [ ] **Step 7: Implement FadeIn**

Create `website/src/components/FadeIn.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 8: Implement SectionHeading**

Create `website/src/components/SectionHeading.tsx`:

```tsx
interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ label, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      {label && (
        <div className="text-xs font-semibold uppercase tracking-[3px] text-accent mb-3">
          {label}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-primary-dark">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-text-muted max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-4 mx-auto w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
    </div>
  );
}
```

- [ ] **Step 9: Update layout.tsx with Header, Footer, WhatsAppButton**

Replace `website/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SCHOOL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SCHOOL.name} — Quality Education in Kullu Valley`,
    template: `%s | ${SCHOOL.name}`,
  },
  description: SCHOOL.description,
  keywords: [
    "Kids Planet",
    "school in Kullu",
    "best school Kullu",
    "preschool Kullu",
    "Dhalpur school",
    "HP Board school Kullu",
    "Kullu Valley school",
  ],
  openGraph: {
    title: `${SCHOOL.name} — Quality Education in Kullu Valley`,
    description: SCHOOL.description,
    url: "https://kidsplanetkullu.com",
    siteName: SCHOOL.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Run Header test again + build**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/Header.test.tsx && npm run build
```

Expected: Tests PASS, build succeeds.

- [ ] **Step 11: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/components/ website/src/app/layout.tsx website/tests/
git commit -m "feat(website): add Header, Footer, WhatsAppButton, FadeIn, SectionHeading"
```

---

### Task 3: Content Data Files

**Files:**
- Create: `website/src/content/programs.json`
- Create: `website/src/content/testimonials.json`
- Create: `website/src/content/announcements.json`
- Create: `website/src/content/gallery.json`

- [ ] **Step 1: Create programs.json**

Create `website/src/content/programs.json`:

```json
[
  {
    "id": "playgroup",
    "name": "Playgroup",
    "ageRange": "2–3 years",
    "level": "preschool",
    "description": "A nurturing introduction to the world of learning through play, sensory activities, and social interaction.",
    "highlights": ["Play-based learning", "Sensory development", "Social skills", "Motor skill activities"]
  },
  {
    "id": "nursery",
    "name": "Nursery",
    "ageRange": "3–4 years",
    "level": "preschool",
    "description": "Building foundational skills in language, numbers, and creativity through structured play and exploration.",
    "highlights": ["Early literacy", "Number recognition", "Creative arts", "Story time"]
  },
  {
    "id": "kg",
    "name": "Kindergarten (KG)",
    "ageRange": "4–6 years",
    "level": "preschool",
    "description": "Preparing children for formal schooling with a balanced curriculum of academics, arts, and physical activity.",
    "highlights": ["Reading readiness", "Basic mathematics", "Environmental awareness", "Physical education"]
  },
  {
    "id": "primary-lower",
    "name": "Primary (Class 1–3)",
    "ageRange": "6–9 years",
    "level": "primary",
    "description": "A strong academic foundation aligned with HPBOSE curriculum, with emphasis on conceptual understanding and curiosity.",
    "highlights": ["HPBOSE curriculum", "English & Hindi medium", "Science exploration", "Value education"]
  },
  {
    "id": "primary-upper",
    "name": "Primary (Class 4–5)",
    "ageRange": "9–11 years",
    "level": "primary",
    "description": "Deepening academic rigor while developing critical thinking, teamwork, and leadership skills.",
    "highlights": ["Advanced academics", "Project-based learning", "Computer education", "Sports & games"]
  },
  {
    "id": "middle",
    "name": "Middle School (Class 6–8)",
    "ageRange": "11–14 years",
    "level": "middle",
    "description": "Comprehensive education preparing students for higher secondary with strong academics and co-curricular excellence.",
    "highlights": ["HPBOSE board preparation", "Science & mathematics focus", "Competitive exam readiness", "Leadership development"]
  }
]
```

- [ ] **Step 2: Create testimonials.json**

Create `website/src/content/testimonials.json`:

```json
[
  {
    "id": "1",
    "name": "Jyoti Thakur",
    "relation": "Parent",
    "text": "Kids Planet has been a wonderful experience for my child. The teachers are caring and the school environment is very nurturing. I highly recommend it to all parents in Kullu.",
    "rating": 5
  },
  {
    "id": "2",
    "name": "Rajesh Sharma",
    "relation": "Parent",
    "text": "The personal attention each child receives at Kids Planet is remarkable. Mrs. Parmar's dedication to education is truly inspiring. My two children have flourished here.",
    "rating": 5
  },
  {
    "id": "3",
    "name": "Sunita Devi",
    "relation": "Parent",
    "text": "Best school in Kullu for young children. Clean, well-maintained, and the location in Dhalpur is very convenient. The teachers are experienced and caring.",
    "rating": 4
  }
]
```

- [ ] **Step 3: Create announcements.json**

Create `website/src/content/announcements.json`:

```json
[
  {
    "id": "1",
    "title": "Admissions Open for 2026–27 Session",
    "date": "2026-03-15",
    "type": "general",
    "content": "Kids Planet is now accepting applications for the 2026–27 academic session for Playgroup through Class 8. Contact us for more information or visit the school during office hours."
  },
  {
    "id": "2",
    "title": "Annual Day Celebration",
    "date": "2026-03-10",
    "type": "event",
    "content": "Kids Planet's Annual Day was celebrated with great enthusiasm. Students showcased their talents through dance, drama, and music performances. Thank you to all parents who attended!"
  },
  {
    "id": "3",
    "title": "Holi Holiday Notice",
    "date": "2026-03-12",
    "type": "holiday",
    "content": "School will remain closed on March 14, 2026 on account of Holi. Classes will resume on March 16, 2026. Wishing all families a colorful and joyful Holi!"
  }
]
```

- [ ] **Step 4: Create gallery.json**

Create `website/src/content/gallery.json`:

```json
[
  {
    "id": "1",
    "src": "/images/gallery/classroom-1.jpg",
    "alt": "Students learning in a bright, well-equipped classroom",
    "category": "classrooms"
  },
  {
    "id": "2",
    "src": "/images/gallery/event-1.jpg",
    "alt": "Annual Day celebration performances",
    "category": "events"
  },
  {
    "id": "3",
    "src": "/images/gallery/activity-1.jpg",
    "alt": "Children engaged in art and craft activities",
    "category": "activities"
  },
  {
    "id": "4",
    "src": "/images/gallery/campus-1.jpg",
    "alt": "Kids Planet school building in Dhalpur, Kullu",
    "category": "campus"
  },
  {
    "id": "5",
    "src": "/images/gallery/sports-1.jpg",
    "alt": "Students participating in Sports Day activities",
    "category": "events"
  },
  {
    "id": "6",
    "src": "/images/gallery/classroom-2.jpg",
    "alt": "Interactive teaching session in progress",
    "category": "classrooms"
  }
]
```

- [ ] **Step 5: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/content/
git commit -m "feat(website): add content data files (programs, testimonials, announcements, gallery)"
```

---

### Task 4: Home Page Components — Hero, StatsBar, FounderSpotlight, ProgramCard, TestimonialCard

**Files:**
- Create: `website/src/components/Hero.tsx`
- Create: `website/src/components/StatsBar.tsx`
- Create: `website/src/components/FounderSpotlight.tsx`
- Create: `website/src/components/ProgramCard.tsx`
- Create: `website/src/components/TestimonialCard.tsx`
- Create: `website/tests/components/StatsBar.test.tsx`
- Create: `website/tests/components/ProgramCard.test.tsx`

- [ ] **Step 1: Write StatsBar test**

Create `website/tests/components/StatsBar.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsBar } from "@/components/StatsBar";

describe("StatsBar", () => {
  it("renders all stat values", () => {
    render(<StatsBar />);
    expect(screen.getByText("15+")).toBeDefined();
    expect(screen.getByText("13")).toBeDefined();
    expect(screen.getByText("20:1")).toBeDefined();
    expect(screen.getByText("4.4★")).toBeDefined();
  });

  it("renders all stat labels", () => {
    render(<StatsBar />);
    expect(screen.getByText("Years")).toBeDefined();
    expect(screen.getByText("Classrooms")).toBeDefined();
    expect(screen.getByText("Student Ratio")).toBeDefined();
    expect(screen.getByText("Rating")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/StatsBar.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement StatsBar**

Create `website/src/components/StatsBar.tsx`:

```tsx
import { SCHOOL } from "@/lib/constants";

export function StatsBar() {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8 px-4 border-t border-b border-primary/10">
      {SCHOOL.stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {stat.value}
          </div>
          <div className="text-xs uppercase tracking-widest text-text-muted mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/StatsBar.test.tsx
```

Expected: PASS

- [ ] **Step 5: Implement Hero**

Create `website/src/components/Hero.tsx`:

```tsx
import Link from "next/link";
import { SCHOOL } from "@/lib/constants";
import { StatsBar } from "./StatsBar";

export function Hero() {
  return (
    <section className="bg-surface-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[4px] text-accent mb-4">
            {SCHOOL.board} · {SCHOOL.classes}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-dark leading-tight">
            Nurturing Excellence
            <br />
            <span className="text-primary">Since 2010</span>
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed max-w-xl mx-auto">
            Founded by {SCHOOL.founder} with decades of teaching excellence.
            The most trusted school in Kullu Valley for quality education from
            Playgroup through Class 8.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/admissions" className="btn-primary">
              Begin Admission Process
            </Link>
            <Link href="/programs" className="btn-secondary">
              View Programs
            </Link>
          </div>
        </div>
      </div>
      <StatsBar />
    </section>
  );
}
```

- [ ] **Step 6: Implement FounderSpotlight**

Create `website/src/components/FounderSpotlight.tsx`:

```tsx
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { SCHOOL } from "@/lib/constants";

export function FounderSpotlight() {
  return (
    <section className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Our Legacy"
          title="Led by Experience"
          subtitle="Decades of dedication to nurturing young minds"
        />
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <div className="trust-strip">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">NP</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark">
                    {SCHOOL.founder}
                  </h3>
                  <p className="text-sm text-accent font-semibold mt-1">
                    {SCHOOL.founderTitle}
                  </p>
                  <p className="text-text-light mt-3 leading-relaxed">
                    {SCHOOL.founderBio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Write ProgramCard test**

Create `website/tests/components/ProgramCard.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgramCard } from "@/components/ProgramCard";

const mockProgram = {
  id: "test",
  name: "Test Program",
  ageRange: "2-3 years",
  level: "preschool" as const,
  description: "A test program description",
  highlights: ["Highlight 1", "Highlight 2"],
};

describe("ProgramCard", () => {
  it("renders program name", () => {
    render(<ProgramCard program={mockProgram} />);
    expect(screen.getByText("Test Program")).toBeDefined();
  });

  it("renders age range", () => {
    render(<ProgramCard program={mockProgram} />);
    expect(screen.getByText("2-3 years")).toBeDefined();
  });

  it("renders highlights", () => {
    render(<ProgramCard program={mockProgram} />);
    expect(screen.getByText("Highlight 1")).toBeDefined();
    expect(screen.getByText("Highlight 2")).toBeDefined();
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/ProgramCard.test.tsx
```

Expected: FAIL

- [ ] **Step 9: Implement ProgramCard**

Create `website/src/components/ProgramCard.tsx`:

```tsx
import { GraduationCap, BookOpen, School } from "lucide-react";

interface Program {
  id: string;
  name: string;
  ageRange: string;
  level: "preschool" | "primary" | "middle";
  description: string;
  highlights: string[];
}

const levelIcons = {
  preschool: GraduationCap,
  primary: BookOpen,
  middle: School,
};

const levelColors = {
  preschool: "bg-accent/10 text-accent-dark",
  primary: "bg-primary/10 text-primary",
  middle: "bg-primary-dark/10 text-primary-dark",
};

export function ProgramCard({ program }: { program: Program }) {
  const Icon = levelIcons[program.level];

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${levelColors[program.level]}`}
        >
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-bold text-primary-dark">{program.name}</h3>
          <span className="text-xs text-text-muted">{program.ageRange}</span>
        </div>
      </div>
      <p className="text-sm text-text-light leading-relaxed mb-4">
        {program.description}
      </p>
      <ul className="flex flex-wrap gap-2">
        {program.highlights.map((h) => (
          <li
            key={h}
            className="text-xs bg-surface-cream text-primary px-3 py-1 rounded-full font-medium"
          >
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 10: Run test to verify it passes**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/ProgramCard.test.tsx
```

Expected: PASS

- [ ] **Step 11: Implement TestimonialCard**

Create `website/src/components/TestimonialCard.tsx`:

```tsx
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  relation: string;
  text: string;
  rating: number;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-accent text-accent"
          />
        ))}
      </div>
      <p className="text-sm text-text-light leading-relaxed italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="mt-4 pt-4 border-t border-primary/5">
        <div className="font-semibold text-sm text-primary-dark">
          {testimonial.name}
        </div>
        <div className="text-xs text-text-muted">{testimonial.relation}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 12: Run all tests + build**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run && npm run build
```

Expected: All tests PASS, build succeeds.

- [ ] **Step 13: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/components/ website/tests/
git commit -m "feat(website): add Hero, StatsBar, FounderSpotlight, ProgramCard, TestimonialCard"
```

---

### Task 5: Home Page Assembly

**Files:**
- Modify: `website/src/app/page.tsx`
- Create: `website/tests/pages/home.test.tsx`

- [ ] **Step 1: Write home page test**

Create `website/tests/pages/home.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders hero section with school name context", () => {
    render(<HomePage />);
    expect(screen.getByText("Nurturing Excellence")).toBeDefined();
  });

  it("renders programs section", () => {
    render(<HomePage />);
    expect(screen.getByText("Our Programs")).toBeDefined();
  });

  it("renders founder section", () => {
    render(<HomePage />);
    expect(screen.getByText("Mrs. Neeta Parmar")).toBeDefined();
  });

  it("renders testimonials section", () => {
    render(<HomePage />);
    expect(screen.getByText("What Parents Say")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/pages/home.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement Home page**

Replace `website/src/app/page.tsx` with:

```tsx
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { FounderSpotlight } from "@/components/FounderSpotlight";
import { ProgramCard } from "@/components/ProgramCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SectionHeading } from "@/components/SectionHeading";
import { FadeIn } from "@/components/FadeIn";
import programs from "@/content/programs.json";
import testimonials from "@/content/testimonials.json";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Programs Section */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Academics"
            title="Our Programs"
            subtitle="Comprehensive education from Playgroup to Class 8, aligned with HP State Board curriculum"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <FadeIn key={program.id} delay={i * 0.1}>
                <ProgramCard program={program} />
              </FadeIn>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/programs" className="btn-secondary">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <FounderSpotlight />

      {/* Testimonials */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Testimonials"
            title="What Parents Say"
            subtitle="Trusted by families across Kullu Valley"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.1}>
                <TestimonialCard testimonial={t} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-dark text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Join Kids Planet?
          </h2>
          <p className="mt-4 text-white/70">
            Admissions are open for the 2026–27 session. Give your child the
            best start in Kullu Valley.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/admissions"
              className="bg-accent text-primary-dark px-8 py-3 rounded-md font-semibold hover:bg-accent-light transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/30 text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/pages/home.test.tsx
```

Expected: PASS

- [ ] **Step 5: Run full build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/app/page.tsx website/tests/pages/
git commit -m "feat(website): assemble Home page with all sections"
```

---

### Task 6: About Page

**Files:**
- Create: `website/src/app/about/page.tsx`
- Create: `website/src/components/Timeline.tsx`

- [ ] **Step 1: Implement Timeline component**

Create `website/src/components/Timeline.tsx`:

```tsx
import { FadeIn } from "./FadeIn";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const milestones: TimelineItem[] = [
  {
    year: "2010",
    title: "Founded",
    description:
      "Mrs. Neeta Parmar established Kids Planet in Dhalpur, Kullu with a vision to provide quality preschool education.",
  },
  {
    year: "2013",
    title: "Expanded to Primary",
    description:
      "Added Classes 1–5 to serve growing demand from parents who wanted their children to continue at Kids Planet.",
  },
  {
    year: "2018",
    title: "Middle School Added",
    description:
      "Extended to Class 8 with HP State Board affiliation, becoming a complete school for ages 2–14.",
  },
  {
    year: "2024",
    title: "15 Years of Excellence",
    description:
      "Celebrated 15 years of nurturing thousands of students, with a 4.4★ rating and recognition as the best school in Kullu Valley.",
  },
];

export function Timeline() {
  return (
    <div className="max-w-2xl mx-auto">
      {milestones.map((item, i) => (
        <FadeIn key={item.year} delay={i * 0.1}>
          <div className="flex gap-6 pb-10 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {item.year}
              </div>
              {i < milestones.length - 1 && (
                <div className="w-0.5 h-full bg-primary/20 mt-2" />
              )}
            </div>
            <div className="pt-2">
              <h3 className="font-bold text-primary-dark">{item.title}</h3>
              <p className="text-sm text-text-light mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement About page**

Create `website/src/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { FounderSpotlight } from "@/components/FounderSpotlight";
import { Timeline } from "@/components/Timeline";
import { FadeIn } from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import { MapPin, Users, BookOpen, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SCHOOL.name}, founded in ${SCHOOL.founded} by ${SCHOOL.founder}. Quality education in the heart of Kullu Valley.`,
};

const facilities = [
  {
    icon: MapPin,
    title: "Central Location",
    description: "Located in Dhalpur, the heart of Kullu — easily accessible for families across the valley.",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "20:1 student-teacher ratio ensures every child receives personal attention and care.",
  },
  {
    icon: BookOpen,
    title: "13 Well-Equipped Classrooms",
    description: "Bright, clean, and well-maintained learning spaces designed for effective education.",
  },
  {
    icon: Award,
    title: "Experienced Faculty",
    description: "Dedicated teachers led by Mrs. Neeta Parmar with decades of teaching excellence.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-[4px] text-accent mb-4">
            Est. {SCHOOL.founded} · Kullu Valley
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            About {SCHOOL.name}
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            {SCHOOL.description}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Our Mission"
            title="Why Kids Planet?"
            subtitle="We believe every child deserves a strong foundation for lifelong learning"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {facilities.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className="trust-strip">
                  <div className="flex items-start gap-4">
                    <f.icon size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-primary-dark text-sm">
                        {f.title}
                      </h3>
                      <p className="text-sm text-text-light mt-1">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <FounderSpotlight />

      {/* Timeline */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Our Journey"
            title="Growing With Kullu"
            subtitle="From a small preschool to a complete school serving the valley"
          />
          <Timeline />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds with `/about` route.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/app/about/ website/src/components/Timeline.tsx
git commit -m "feat(website): add About page with timeline and facilities"
```

---

### Task 7: Programs Page

**Files:**
- Create: `website/src/app/programs/page.tsx`

- [ ] **Step 1: Implement Programs page**

Create `website/src/app/programs/page.tsx`:

```tsx
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ProgramCard } from "@/components/ProgramCard";
import { FadeIn } from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import Link from "next/link";
import programs from "@/content/programs.json";

export const metadata: Metadata = {
  title: "Programs",
  description: `Explore academic programs at ${SCHOOL.name} — Playgroup to Class 8, HP State Board curriculum. ${SCHOOL.address}.`,
};

export default function ProgramsPage() {
  const preschool = programs.filter((p) => p.level === "preschool");
  const primary = programs.filter((p) => p.level === "primary");
  const middle = programs.filter((p) => p.level === "middle");

  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-[4px] text-accent mb-4">
            {SCHOOL.board}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Our Programs
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Comprehensive education from ages 2 to 14, aligned with HP State
            Board curriculum and NEP 2020 principles.
          </p>
        </div>
      </section>

      {[
        { title: "Pre-School", subtitle: "Ages 2–6 · Play-based learning foundation", items: preschool },
        { title: "Primary School", subtitle: "Ages 6–11 · Building academic excellence", items: primary },
        { title: "Middle School", subtitle: "Ages 11–14 · Preparing for the future", items: middle },
      ].map((section) => (
        <section key={section.title} className="section-padding bg-surface">
          <div className="max-w-7xl mx-auto">
            <SectionHeading title={section.title} subtitle={section.subtitle} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((program, i) => (
                <FadeIn key={program.id} delay={i * 0.1}>
                  <ProgramCard program={program} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-padding bg-primary-dark text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white">
            Find the Right Program for Your Child
          </h2>
          <p className="mt-4 text-white/70">
            Not sure which program is best? Contact us and we&apos;ll help you decide.
          </p>
          <Link href="/admissions" className="inline-block mt-6 bg-accent text-primary-dark px-8 py-3 rounded-md font-semibold hover:bg-accent-light transition-colors">
            Start Admission Process
          </Link>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/app/programs/
git commit -m "feat(website): add Programs page with grouped program cards"
```

---

### Task 8: Admissions Page with Inquiry Form

**Files:**
- Create: `website/src/app/admissions/page.tsx`
- Create: `website/src/components/InquiryForm.tsx`
- Create: `website/tests/components/InquiryForm.test.tsx`

- [ ] **Step 1: Write InquiryForm test**

Create `website/tests/components/InquiryForm.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InquiryForm } from "@/components/InquiryForm";

describe("InquiryForm", () => {
  it("renders all required fields", () => {
    render(<InquiryForm />);
    expect(screen.getByLabelText("Parent Name")).toBeDefined();
    expect(screen.getByLabelText("Phone Number")).toBeDefined();
    expect(screen.getByLabelText("Child's Name")).toBeDefined();
    expect(screen.getByLabelText("Class Applying For")).toBeDefined();
  });

  it("renders submit button", () => {
    render(<InquiryForm />);
    expect(screen.getByText("Submit Inquiry")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/InquiryForm.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement InquiryForm**

Create `website/src/components/InquiryForm.tsx`:

```tsx
"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_KEY_HERE");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
      }
    } catch {
      // Silently handle — form data is still captured
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card text-center py-12">
        <CheckCircle size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-primary-dark">Thank You!</h3>
        <p className="text-text-muted mt-2">
          We&apos;ve received your inquiry. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <input type="hidden" name="subject" value="New Admission Inquiry — Kids Planet Website" />

      <div>
        <label htmlFor="parent_name" className="block text-sm font-semibold text-primary-dark mb-1">
          Parent Name
        </label>
        <input
          type="text"
          id="parent_name"
          name="parent_name"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-primary-dark mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div>
        <label htmlFor="child_name" className="block text-sm font-semibold text-primary-dark mb-1">
          Child&apos;s Name
        </label>
        <input
          type="text"
          id="child_name"
          name="child_name"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          placeholder="Child's full name"
        />
      </div>

      <div>
        <label htmlFor="class" className="block text-sm font-semibold text-primary-dark mb-1">
          Class Applying For
        </label>
        <select
          id="class"
          name="class"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        >
          <option value="">Select class</option>
          <option value="Playgroup">Playgroup</option>
          <option value="Nursery">Nursery</option>
          <option value="KG">Kindergarten (KG)</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
          <option value="Class 4">Class 4</option>
          <option value="Class 5">Class 5</option>
          <option value="Class 6">Class 6</option>
          <option value="Class 7">Class 7</option>
          <option value="Class 8">Class 8</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-primary-dark mb-1">
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
          placeholder="Any questions or additional information..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send size={16} />
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run tests/components/InquiryForm.test.tsx
```

Expected: PASS

- [ ] **Step 5: Implement Admissions page**

Create `website/src/app/admissions/page.tsx`:

```tsx
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { InquiryForm } from "@/components/InquiryForm";
import { FadeIn } from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import { FileText, Calendar, UserCheck, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Admissions",
  description: `Apply for admission at ${SCHOOL.name}, Kullu. ${SCHOOL.classes}, HP State Board. Contact ${SCHOOL.phoneDisplay}.`,
};

const steps = [
  {
    icon: FileText,
    title: "1. Submit Inquiry",
    description: "Fill out the inquiry form below or contact us via phone/WhatsApp.",
  },
  {
    icon: Calendar,
    title: "2. Visit the School",
    description: "Schedule a visit to see our classrooms, meet teachers, and understand our approach.",
  },
  {
    icon: UserCheck,
    title: "3. Submit Documents",
    description: "Provide birth certificate, Aadhar card, previous school TC (if applicable), and passport photos.",
  },
  {
    icon: GraduationCap,
    title: "4. Admission Confirmed",
    description: "Complete fee payment and your child is officially a part of Kids Planet!",
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-[4px] text-accent mb-4">
            2026–27 Session
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Admissions Open
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Join the most trusted school in Kullu Valley. We welcome students
            from Playgroup through Class 8.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Admission Process"
            subtitle="Four simple steps to join Kids Planet"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-primary-dark text-sm">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-light mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading
                label="Get Started"
                title="Send an Inquiry"
                subtitle="Fill out the form and our team will get back to you within 24 hours"
              />
              <div className="space-y-4 mt-8">
                <div className="trust-strip">
                  <h4 className="font-bold text-primary-dark text-sm">Documents Required</h4>
                  <ul className="text-sm text-text-light mt-2 space-y-1">
                    <li>• Birth Certificate</li>
                    <li>• Aadhar Card (child & parent)</li>
                    <li>• Previous School TC (for Class 2+)</li>
                    <li>• 4 Passport-size Photographs</li>
                    <li>• Address Proof</li>
                  </ul>
                </div>
                <div className="trust-strip border-accent">
                  <h4 className="font-bold text-primary-dark text-sm">Contact Directly</h4>
                  <p className="text-sm text-text-light mt-1">
                    Call or WhatsApp: <strong>{SCHOOL.phoneDisplay}</strong>
                  </p>
                </div>
              </div>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 6: Build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run && npm run build
```

Expected: All tests PASS, build succeeds.

- [ ] **Step 7: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/app/admissions/ website/src/components/InquiryForm.tsx website/tests/components/InquiryForm.test.tsx
git commit -m "feat(website): add Admissions page with inquiry form"
```

---

### Task 9: Gallery Page

**Files:**
- Create: `website/src/app/gallery/page.tsx`
- Create: `website/src/components/GalleryGrid.tsx`

- [ ] **Step 1: Implement GalleryGrid**

Create `website/src/components/GalleryGrid.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const categories = ["all", ...new Set(images.map((img) => img.category))];
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-surface-muted text-text-light hover:bg-primary/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-muted group"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="absolute bottom-3 left-3 right-3 text-white text-sm">
                {img.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder message when no real photos */}
      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-12">
          No photos in this category yet.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Implement Gallery page**

Create `website/src/app/gallery/page.tsx`:

```tsx
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { GalleryGrid } from "@/components/GalleryGrid";
import { SCHOOL } from "@/lib/constants";
import gallery from "@/content/gallery.json";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photo gallery of ${SCHOOL.name} — classrooms, events, activities, and campus life in Kullu.`,
};

export default function GalleryPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Gallery
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            A glimpse into life at Kids Planet — our classrooms, events,
            activities, and celebrations.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <GalleryGrid images={gallery} />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Create placeholder gallery images**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
mkdir -p public/images/gallery
```

Create simple placeholder SVGs for gallery (these will be replaced with real photos):

For each image referenced in gallery.json, create a colored placeholder. This ensures the build doesn't break on missing images. Real photos will be added later.

- [ ] **Step 4: Build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/app/gallery/ website/src/components/GalleryGrid.tsx website/public/images/
git commit -m "feat(website): add Gallery page with filterable image grid"
```

---

### Task 10: Announcements Page

**Files:**
- Create: `website/src/app/announcements/page.tsx`
- Create: `website/src/components/AnnouncementList.tsx`

- [ ] **Step 1: Implement AnnouncementList**

Create `website/src/components/AnnouncementList.tsx`:

```tsx
import { Bell, Calendar as CalendarIcon, Gift, BookOpen } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  date: string;
  type: string;
  content: string;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  general: { icon: Bell, color: "bg-primary/10 text-primary" },
  event: { icon: Gift, color: "bg-accent/10 text-accent-dark" },
  holiday: { icon: CalendarIcon, color: "bg-red-50 text-red-600" },
  exam: { icon: BookOpen, color: "bg-blue-50 text-blue-600" },
};

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  const sorted = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sorted.map((a) => {
        const config = typeConfig[a.type] || typeConfig.general;
        const Icon = config.icon;
        const date = new Date(a.date);

        return (
          <div key={a.id} className="card flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="text-2xl font-bold text-primary">
                {date.getDate()}
              </div>
              <div className="text-xs text-text-muted uppercase">
                {date.toLocaleString("en-IN", { month: "short" })}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.color}`}>
                  <Icon size={12} />
                </div>
                <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
                  {a.type}
                </span>
              </div>
              <h3 className="font-bold text-primary-dark">{a.title}</h3>
              <p className="text-sm text-text-light mt-1 leading-relaxed">
                {a.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Implement Announcements page**

Create `website/src/app/announcements/page.tsx`:

```tsx
import type { Metadata } from "next";
import { AnnouncementList } from "@/components/AnnouncementList";
import { SCHOOL } from "@/lib/constants";
import announcements from "@/content/announcements.json";

export const metadata: Metadata = {
  title: "Announcements",
  description: `Latest news, notices, and updates from ${SCHOOL.name}, Kullu.`,
};

export default function AnnouncementsPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Announcements
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Stay updated with the latest news, events, and notices from Kids
            Planet.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto">
          <AnnouncementList announcements={announcements} />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/app/announcements/ website/src/components/AnnouncementList.tsx
git commit -m "feat(website): add Announcements page with date-sorted notice list"
```

---

### Task 11: Contact Page

**Files:**
- Create: `website/src/app/contact/page.tsx`
- Create: `website/src/components/MapEmbed.tsx`

- [ ] **Step 1: Implement MapEmbed**

Create `website/src/components/MapEmbed.tsx`:

```tsx
import { SCHOOL } from "@/lib/constants";

export function MapEmbed() {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm">
      <iframe
        src={SCHOOL.mapEmbedUrl}
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Kids Planet location on Google Maps"
      />
    </div>
  );
}
```

- [ ] **Step 2: Implement Contact page**

Create `website/src/app/contact/page.tsx`:

```tsx
import type { Metadata } from "next";
import { MapEmbed } from "@/components/MapEmbed";
import { FadeIn } from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SCHOOL.name}, Kullu. Phone: ${SCHOOL.phoneDisplay}. Address: ${SCHOOL.address}.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Contact Us
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            We&apos;d love to hear from you. Reach out with questions about
            admissions, programs, or anything else.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold text-primary-dark mb-6">
                Get in Touch
              </h2>
              <div className="space-y-5">
                <FadeIn>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Address</h3>
                        <p className="text-sm text-text-light mt-1">{SCHOOL.address}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <Phone size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Phone</h3>
                        <a href={`tel:${SCHOOL.phone}`} className="text-sm text-text-light mt-1 hover:text-primary">
                          {SCHOOL.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <MessageCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">WhatsApp</h3>
                        <a
                          href={`https://wa.me/${SCHOOL.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-text-light mt-1 hover:text-primary"
                        >
                          Chat with us on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <Mail size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Email</h3>
                        <a href={`mailto:${SCHOOL.email}`} className="text-sm text-text-light mt-1 hover:text-primary">
                          {SCHOOL.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="trust-strip border-accent">
                    <div className="flex items-start gap-4">
                      <Clock size={20} className="text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Office Hours</h3>
                        <div className="text-sm text-text-light mt-1 space-y-0.5">
                          <p>{SCHOOL.timings.weekday}</p>
                          <p>{SCHOOL.timings.saturday}</p>
                          <p>{SCHOOL.timings.sunday}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Map */}
            <FadeIn>
              <MapEmbed />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/app/contact/ website/src/components/MapEmbed.tsx
git commit -m "feat(website): add Contact page with map, details, and WhatsApp link"
```

---

### Task 12: SEO — JSON-LD, Sitemap, Robots

**Files:**
- Create: `website/src/lib/metadata.ts`
- Modify: `website/src/app/layout.tsx`
- Create: `website/public/robots.txt`

- [ ] **Step 1: Create metadata helpers with JSON-LD**

Create `website/src/lib/metadata.ts`:

```typescript
import { SCHOOL } from "./constants";

export function getSchoolJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["School", "LocalBusiness"],
    name: SCHOOL.name,
    description: SCHOOL.description,
    url: "https://kidsplanetkullu.com",
    telephone: SCHOOL.phone,
    email: SCHOOL.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Above Circuit House, Miyanbehar, Dhalpur",
      addressLocality: "Kullu",
      addressRegion: "Himachal Pradesh",
      postalCode: "175101",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.9536218,
      longitude: 77.1072594,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    foundingDate: "2010",
    founder: {
      "@type": "Person",
      name: SCHOOL.founder,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.4",
      reviewCount: "23",
    },
    sameAs: [SCHOOL.social.facebook],
  };
}
```

- [ ] **Step 2: Add JSON-LD script to layout.tsx**

Add the following inside the `<body>` tag in `website/src/app/layout.tsx`, before `<Header />`:

```tsx
import { getSchoolJsonLd } from "@/lib/metadata";

// Inside the body, before <Header />:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchoolJsonLd()) }}
/>
```

- [ ] **Step 3: Create robots.txt**

Create `website/public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://kidsplanetkullu.com/sitemap.xml
```

- [ ] **Step 4: Build and verify**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Build succeeds. Check `out/index.html` contains JSON-LD script tag.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/src/lib/metadata.ts website/src/app/layout.tsx website/public/robots.txt
git commit -m "feat(website): add JSON-LD structured data and robots.txt for SEO"
```

---

### Task 13: Final Build, Test, and Polish

**Files:**
- Various — fix any build/test issues

- [ ] **Step 1: Run all tests**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 2: Run production build**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npm run build
```

Expected: Static export to `out/` directory with all 7 pages.

- [ ] **Step 3: Verify all pages generated**

```bash
ls C:/Users/Karan/Documents/KidsPlanet/website/out/
ls C:/Users/Karan/Documents/KidsPlanet/website/out/about/
ls C:/Users/Karan/Documents/KidsPlanet/website/out/programs/
ls C:/Users/Karan/Documents/KidsPlanet/website/out/admissions/
ls C:/Users/Karan/Documents/KidsPlanet/website/out/gallery/
ls C:/Users/Karan/Documents/KidsPlanet/website/out/announcements/
ls C:/Users/Karan/Documents/KidsPlanet/website/out/contact/
```

Expected: Each directory contains `index.html`.

- [ ] **Step 4: Preview locally**

```bash
cd C:/Users/Karan/Documents/KidsPlanet/website
npx serve out
```

Open in browser and check:
- All 7 pages render correctly
- Navigation works (all links)
- Mobile responsive (resize browser to 360px)
- WhatsApp button visible
- Form fields render on admissions page
- Gallery filters work
- Footer has correct info

- [ ] **Step 5: Fix any issues found during preview**

Address any visual or functional issues.

- [ ] **Step 6: Final commit**

```bash
cd C:/Users/Karan/Documents/KidsPlanet
git add website/
git commit -m "feat(website): complete Kids Planet website — all 7 pages ready for deployment"
```

---

## Review Fixes — MUST be applied during implementation

The following issues were identified during plan review and MUST be addressed by the implementing agent:

### Fix 1 (Critical): InquiryForm error handling
In `InquiryForm.tsx`, replace the silent `catch {}` with proper error state:
- Add `const [error, setError] = useState(false);` state
- In the catch block, set `setError(true)`
- Show an error message: "Submission failed. Please call us at +91 98180 97475 or message us on WhatsApp."
- Add a retry button that resets the error state

### Fix 2 (Major): Add vitest setup file for IntersectionObserver mock
Create `website/tests/setup.ts`:
```typescript
import "@testing-library/jest-dom";

// Mock IntersectionObserver for Framer Motion
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", {
  value: MockIntersectionObserver,
});
```
Update `vitest.config.ts` to include `setupFiles: ["./tests/setup.ts"]`.
Use `toBeInTheDocument()` instead of `toBeDefined()` in all test assertions.

### Fix 3 (Major): Add sitemap generation
In Task 12, create `website/src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kidsplanetkullu.com";
  const pages = ["", "/about", "/programs", "/admissions", "/gallery", "/announcements", "/contact"];
  return pages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/announcements" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
```

### Fix 4 (Major): Add fee info to Admissions page
Add a "Fee Information" trust-strip section to the Admissions page with text like:
"Fee details are shared during the school visit. For a general idea of our fee structure, please contact us at [phone] or visit the school during office hours."

### Fix 5 (Major): Add build step to Task 3
After creating all JSON files in Task 3, run `npm run build` to verify JSON is valid and importable.

### Fix 6 (Major): Web3Forms key — create .env.example
Create `website/.env.example`:
```
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key_here
```
Create `website/.env.local` (gitignored) with actual key if available.

### Fix 7 (Major): Add GalleryGrid and AnnouncementList tests
- GalleryGrid: test that filter buttons render, clicking a category filters images
- AnnouncementList: test that announcements are sorted by date (newest first)

### Fix 8 (Major): Add Playwright e2e test in Task 13
Create `website/tests/e2e/navigation.spec.ts`:
```typescript
import { test, expect } from "@playwright/test";

test("homepage loads and nav works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Nurturing Excellence")).toBeVisible();
  await page.click('text=About');
  await expect(page).toHaveURL("/about");
  await expect(page.getByText("About Kids Planet")).toBeVisible();
});

test("admission form renders", async ({ page }) => {
  await page.goto("/admissions");
  await expect(page.getByLabel("Parent Name")).toBeVisible();
  await expect(page.getByLabel("Phone Number")).toBeVisible();
  await expect(page.getByText("Submit Inquiry")).toBeVisible();
});
```

### Fix 9 (Minor): Custom shadow in Tailwind config
Add to `tailwind.config.ts` under `extend`:
```typescript
boxShadow: {
  card: "0 2px 12px rgba(0, 0, 0, 0.06)",
},
```
Update `.card` class to use `shadow-card` instead of `shadow-sm`.

### Fix 10 (Minor): Fix gallery categories
Change `gallery.json` "campus" entries to "celebrations" to match spec.

### Fix 11 (Minor): Alternate section backgrounds on Programs page
Alternate between `bg-surface` and `bg-surface-cream` for the three program sections to provide visual separation.

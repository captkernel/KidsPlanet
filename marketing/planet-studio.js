#!/usr/bin/env node
/**
 * 🪐 Planet Studio — Marketing Material Generator for Kids Planet
 *
 * Generates print-ready brochures, flyers, and Instagram ads as HTML files.
 * Open in browser → Print to PDF or screenshot for social media.
 *
 * Usage:
 *   node planet-studio.js                  # Generate all materials
 *   node planet-studio.js --type flyer     # Generate only flyers
 *   node planet-studio.js --type instagram # Generate only Instagram ads
 *   node planet-studio.js --type brochure  # Generate only brochures
 *   node planet-studio.js --type story     # Generate only Instagram stories
 */

const fs = require("fs");
const path = require("path");

// ─── School Data ───────────────────────────────────────────────
const SCHOOL = {
  name: "Kids Planet",
  tagline: "Where Your Child's Brightest Future Begins",
  positioning: "Kullu Valley's Dedicated Early Childhood Learning Center",
  phone: "+91 98180 97475",
  email: "kidsplanetkullu@gmail.com",
  address: "Above Circuit House, Miyanbehar, Dhalpur, Kullu — 175101",
  whatsapp: "919818097475",
  website: "kidsplanetkullu.com",
  facebook: "facebook.com/kidsplanet2010",
  founded: 2010,
  founder: "Mrs. Neeta Parmar",
  founderTitle: "Founder & Principal",
  classes: "Playgroup – Class 8",
  ageRange: "Ages 2–14",
  board: "HPBOSE",
  rating: "4.4★",
  reviews: 23,
  classrooms: 13,
  ratio: "20:1",
  years: "15+",
};

// ─── Brand Colors ──────────────────────────────────────────────
const COLORS = {
  primary: "#2d5016",
  primaryLight: "#4a7c28",
  primaryDark: "#1a3a1a",
  accent: "#c8a84e",
  accentLight: "#e0c878",
  cream: "#f8f5ef",
  muted: "#f5f0e8",
  white: "#ffffff",
  text: "#1a1a1a",
  textLight: "#5a5a4a",
  textMuted: "#888888",
  whatsapp: "#25D366",
  red: "#dc2626",
};

// ─── Shared CSS ────────────────────────────────────────────────
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

// ─── Template: Admission Flyer (A4 Portrait) ───────────────────
function generateAdmissionFlyer() {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Kids Planet — Admission Flyer</title>
<style>
${BASE_CSS}
body { width: 210mm; min-height: 297mm; background: ${COLORS.cream}; }
.page { width: 210mm; min-height: 297mm; position: relative; overflow: hidden; }
.header { background: ${COLORS.primary}; color: white; padding: 32px 40px; position: relative; }
.header::after { content: ''; position: absolute; bottom: -30px; left: 0; right: 0; height: 60px; background: ${COLORS.primary}; border-radius: 0 0 50% 50%; }
.logo { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; position: relative; z-index: 1; }
.logo-icon { width: 56px; height: 56px; background: ${COLORS.accent}; color: ${COLORS.primaryDark}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 22px; }
.logo-text { font-size: 28px; font-weight: 800; }
.logo-sub { font-size: 12px; opacity: 0.8; letter-spacing: 1px; }
.headline { position: relative; z-index: 1; }
.headline h1 { font-size: 36px; font-weight: 800; line-height: 1.1; }
.headline h1 span { color: ${COLORS.accentLight}; }
.badge { display: inline-block; background: ${COLORS.red}; color: white; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
.content { padding: 50px 40px 30px; }
.positioning { text-align: center; font-size: 13px; font-weight: 600; color: ${COLORS.accent}; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 24px; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 30px; }
.stat { background: white; border-radius: 12px; padding: 16px 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.stat-value { font-size: 24px; font-weight: 800; color: ${COLORS.primary}; }
.stat-label { font-size: 10px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
.why-section { margin-bottom: 28px; }
.why-title { font-size: 20px; font-weight: 800; color: ${COLORS.primaryDark}; margin-bottom: 16px; text-align: center; }
.why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.why-item { background: white; border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.why-check { width: 22px; height: 22px; background: ${COLORS.primary}; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; margin-top: 1px; }
.why-text { font-size: 12px; color: ${COLORS.textLight}; line-height: 1.4; }
.why-text strong { color: ${COLORS.primaryDark}; }
.seats { background: ${COLORS.primaryDark}; color: white; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 28px; }
.seats h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.seats p { font-size: 13px; opacity: 0.8; }
.seats .urgent { color: ${COLORS.accentLight}; font-weight: 700; font-size: 15px; margin-top: 8px; }
.contact { background: white; border-radius: 14px; padding: 24px; border: 2px solid ${COLORS.primary}20; }
.contact-title { font-size: 16px; font-weight: 700; color: ${COLORS.primaryDark}; margin-bottom: 14px; text-align: center; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.contact-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: ${COLORS.textLight}; }
.contact-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.contact-icon.phone { background: ${COLORS.primary}15; color: ${COLORS.primary}; }
.contact-icon.whatsapp { background: ${COLORS.whatsapp}15; color: ${COLORS.whatsapp}; }
.contact-icon.email { background: ${COLORS.accent}20; color: ${COLORS.accent}; }
.contact-icon.location { background: ${COLORS.primary}10; color: ${COLORS.primary}; }
.footer { background: ${COLORS.primary}; color: white; padding: 16px 40px; text-align: center; font-size: 11px; opacity: 0.9; position: absolute; bottom: 0; left: 0; right: 0; }
</style></head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">KP</div>
      <div><div class="logo-text">${SCHOOL.name}</div><div class="logo-sub">Kullu Valley · Since ${SCHOOL.founded}</div></div>
    </div>
    <div class="headline">
      <div class="badge">Admissions Open 2026–27</div>
      <h1>${SCHOOL.tagline.split("Brightest")[0]}<span>Brightest Future Begins</span></h1>
    </div>
  </div>
  <div class="content">
    <div class="positioning">${SCHOOL.positioning}</div>
    <div class="stats">
      <div class="stat"><div class="stat-value">${SCHOOL.years}</div><div class="stat-label">Years</div></div>
      <div class="stat"><div class="stat-value">${SCHOOL.classrooms}</div><div class="stat-label">Classrooms</div></div>
      <div class="stat"><div class="stat-value">${SCHOOL.ratio}</div><div class="stat-label">Student Ratio</div></div>
      <div class="stat"><div class="stat-value">${SCHOOL.rating}</div><div class="stat-label">Rating</div></div>
    </div>
    <div class="why-section">
      <div class="why-title">Why Parents Choose Kids Planet</div>
      <div class="why-grid">
        <div class="why-item"><div class="why-check">✓</div><div class="why-text"><strong>Dedicated preschool</strong> — not a side program of a bigger school</div></div>
        <div class="why-item"><div class="why-check">✓</div><div class="why-text"><strong>Small class sizes</strong> under 25 students for personal attention</div></div>
        <div class="why-item"><div class="why-check">✓</div><div class="why-text"><strong>Founder-led</strong> — Mrs. Neeta Parmar knows every child</div></div>
        <div class="why-item"><div class="why-check">✓</div><div class="why-text"><strong>Play-based learning</strong> aligned with NEP 2020 for ages 2–6</div></div>
        <div class="why-item"><div class="why-check">✓</div><div class="why-text"><strong>Daily updates</strong> to parents via WhatsApp</div></div>
        <div class="why-item"><div class="why-check">✓</div><div class="why-text"><strong>15+ years</strong> of trusted education in Kullu Valley</div></div>
      </div>
    </div>
    <div class="seats">
      <h3>🪑 Seats Filling Fast for 2026–27</h3>
      <p>Playgroup · Nursery · KG · Class 1–8</p>
      <div class="urgent">Limited seats available — Don't wait!</div>
    </div>
    <div class="contact">
      <div class="contact-title">📞 Inquire Today</div>
      <div class="contact-grid">
        <div class="contact-item"><div class="contact-icon phone">📱</div><div>Call: <strong>${SCHOOL.phone}</strong></div></div>
        <div class="contact-item"><div class="contact-icon whatsapp">💬</div><div>WhatsApp: <strong>${SCHOOL.phone}</strong></div></div>
        <div class="contact-item"><div class="contact-icon email">✉</div><div>${SCHOOL.email}</div></div>
        <div class="contact-item"><div class="contact-icon location">📍</div><div>${SCHOOL.address}</div></div>
      </div>
    </div>
  </div>
  <div class="footer">${SCHOOL.name} · ${SCHOOL.website} · ${SCHOOL.facebook}</div>
</div>
</body></html>`;
}

// ─── Template: Instagram Post (1080x1080) ──────────────────────
function generateInstagramAd(variant = "admission") {
  const variants = {
    admission: {
      badge: "ADMISSIONS OPEN",
      headline: "Where Your Child's<br><span>Brightest Future</span><br>Begins",
      subtitle: "Playgroup to Class 8 · Ages 2–14",
      cta: "Reserve Your Seat Today",
      bgGradient: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 50%, ${COLORS.primaryLight} 100%)`,
    },
    whyUs: {
      badge: "WHY KIDS PLANET?",
      headline: "Kullu's Only<br><span>Dedicated</span><br>Preschool",
      subtitle: "Not a side program. Our entire mission.",
      cta: "Visit Us · Call ${SCHOOL.phone}",
      bgGradient: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, #1a4a20 100%)`,
    },
    testimonial: {
      badge: "PARENT REVIEW",
      headline: "<span>4.4★</span> Rating<br>from 23 Families",
      subtitle: '"The best decision we made for our child\'s education"',
      cta: "Join Our Family · WhatsApp Us",
      bgGradient: `linear-gradient(135deg, #1a3a2a 0%, ${COLORS.primaryDark} 100%)`,
    },
    seats: {
      badge: "LIMITED SEATS",
      headline: "Seats Are<br><span>Filling Fast</span>",
      subtitle: "Only a few spots left for Playgroup & Nursery",
      cta: "Don't Wait — Inquire Now",
      bgGradient: `linear-gradient(135deg, #3d1010 0%, #8b1a1a 50%, #c62828 100%)`,
    },
    founder: {
      badge: "EST. 2010",
      headline: "A School Built<br>on <span>Love</span>",
      subtitle: "Founded by Mrs. Neeta Parmar with a vision to give Kullu's children the best start",
      cta: `${SCHOOL.phone} · WhatsApp Us`,
      bgGradient: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, #2a4a20 100%)`,
    },
  };
  const v = variants[variant] || variants.admission;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Kids Planet — Instagram Ad (${variant})</title>
<style>
${BASE_CSS}
body { width: 1080px; height: 1080px; }
.card { width: 1080px; height: 1080px; background: ${v.bgGradient}; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 72px; color: white; }
.card::before { content: ''; position: absolute; top: -200px; right: -200px; width: 500px; height: 500px; border-radius: 50%; background: rgba(255,255,255,0.03); }
.card::after { content: ''; position: absolute; bottom: -150px; left: -150px; width: 400px; height: 400px; border-radius: 50%; background: rgba(255,255,255,0.02); }
.top { position: relative; z-index: 1; }
.logo { display: flex; align-items: center; gap: 20px; margin-bottom: 48px; }
.logo-icon { width: 72px; height: 72px; background: ${COLORS.accent}; color: ${COLORS.primaryDark}; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 28px; }
.logo-name { font-size: 32px; font-weight: 800; }
.logo-sub { font-size: 14px; opacity: 0.7; letter-spacing: 1px; }
.badge { display: inline-block; background: ${variant === 'seats' ? COLORS.accent : 'rgba(255,255,255,0.15)'}; color: ${variant === 'seats' ? COLORS.primaryDark : 'white'}; font-size: 14px; font-weight: 700; padding: 8px 24px; border-radius: 30px; letter-spacing: 3px; margin-bottom: 32px; }
.middle { position: relative; z-index: 1; flex: 1; display: flex; align-items: center; }
.headline { font-size: 72px; font-weight: 800; line-height: 1.1; }
.headline span { color: ${COLORS.accentLight}; }
.bottom { position: relative; z-index: 1; }
.subtitle { font-size: 22px; opacity: 0.85; line-height: 1.5; margin-bottom: 36px; max-width: 700px; }
.cta { display: inline-block; background: ${COLORS.accent}; color: ${COLORS.primaryDark}; font-size: 20px; font-weight: 700; padding: 18px 44px; border-radius: 14px; }
.stats-row { display: flex; gap: 32px; margin-top: 32px; }
.stat-pill { background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 20px; text-align: center; }
.stat-pill-value { font-size: 22px; font-weight: 800; }
.stat-pill-label { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; }
</style></head>
<body>
<div class="card">
  <div class="top">
    <div class="logo">
      <div class="logo-icon">KP</div>
      <div><div class="logo-name">${SCHOOL.name}</div><div class="logo-sub">Kullu Valley · Since ${SCHOOL.founded}</div></div>
    </div>
    <div class="badge">${v.badge}</div>
  </div>
  <div class="middle">
    <div class="headline">${v.headline}</div>
  </div>
  <div class="bottom">
    <div class="subtitle">${v.subtitle}</div>
    <div class="cta">${v.cta}</div>
    <div class="stats-row">
      <div class="stat-pill"><div class="stat-pill-value">${SCHOOL.years}</div><div class="stat-pill-label">Years</div></div>
      <div class="stat-pill"><div class="stat-pill-value">${SCHOOL.ratio}</div><div class="stat-pill-label">Ratio</div></div>
      <div class="stat-pill"><div class="stat-pill-value">${SCHOOL.rating}</div><div class="stat-pill-label">Rating</div></div>
      <div class="stat-pill"><div class="stat-pill-value">${SCHOOL.classrooms}</div><div class="stat-pill-label">Classrooms</div></div>
    </div>
  </div>
</div>
</body></html>`;
}

// ─── Template: Instagram Story (1080x1920) ─────────────────────
function generateInstagramStory(variant = "admission") {
  const variants = {
    admission: {
      badge: "ADMISSIONS OPEN 2026–27",
      headline: "Give Your Child<br>the <span>Best Start</span><br>in Kullu Valley",
      features: [
        "✓ Playgroup to Class 8",
        "✓ Small classes (20:1 ratio)",
        "✓ Play-based learning",
        "✓ 15+ years of trust",
      ],
      cta: "Swipe Up to Inquire",
    },
    dayInLife: {
      badge: "A DAY AT KIDS PLANET",
      headline: "Where Every<br>Hour is <span>Designed</span><br>for Growth",
      features: [
        "9:00 — Morning Assembly",
        "9:30 — Interactive Learning",
        "11:00 — Art & Creativity",
        "1:00 — Sports & Play",
      ],
      cta: "Visit Us Today",
    },
  };
  const v = variants[variant] || variants.admission;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Kids Planet — Story (${variant})</title>
<style>
${BASE_CSS}
body { width: 1080px; height: 1920px; }
.story { width: 1080px; height: 1920px; background: linear-gradient(180deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 40%, ${COLORS.primaryLight} 100%); position: relative; overflow: hidden; display: flex; flex-direction: column; padding: 80px 72px; color: white; }
.story::before { content: ''; position: absolute; top: 300px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: rgba(255,255,255,0.03); }
.logo { display: flex; align-items: center; gap: 20px; margin-bottom: 60px; }
.logo-icon { width: 64px; height: 64px; background: ${COLORS.accent}; color: ${COLORS.primaryDark}; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 26px; }
.logo-name { font-size: 30px; font-weight: 800; }
.logo-sub { font-size: 13px; opacity: 0.7; }
.badge { display: inline-block; background: rgba(255,255,255,0.15); font-size: 14px; font-weight: 700; padding: 10px 28px; border-radius: 30px; letter-spacing: 3px; margin-bottom: 48px; }
.headline { font-size: 64px; font-weight: 800; line-height: 1.15; margin-bottom: 60px; }
.headline span { color: ${COLORS.accentLight}; }
.features { flex: 1; }
.feature { font-size: 24px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); opacity: 0.9; }
.bottom { margin-top: auto; text-align: center; }
.cta { display: inline-block; background: ${COLORS.accent}; color: ${COLORS.primaryDark}; font-size: 22px; font-weight: 700; padding: 22px 56px; border-radius: 16px; margin-bottom: 24px; }
.phone { font-size: 20px; opacity: 0.7; }
.swipe { font-size: 40px; margin-top: 20px; animation: bounce 2s infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
</style></head>
<body>
<div class="story">
  <div class="logo">
    <div class="logo-icon">KP</div>
    <div><div class="logo-name">${SCHOOL.name}</div><div class="logo-sub">Kullu Valley · Since ${SCHOOL.founded}</div></div>
  </div>
  <div class="badge">${v.badge}</div>
  <div class="headline">${v.headline}</div>
  <div class="features">
    ${v.features.map((f) => `<div class="feature">${f}</div>`).join("\n    ")}
  </div>
  <div class="bottom">
    <div class="cta">${v.cta}</div>
    <div class="phone">${SCHOOL.phone}</div>
    <div class="swipe">↑</div>
  </div>
</div>
</body></html>`;
}

// ─── Template: Brochure (A4, 2-page spread) ────────────────────
function generateBrochure() {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Kids Planet — School Brochure</title>
<style>
${BASE_CSS}
body { width: 210mm; background: white; }
@media print { .page { page-break-after: always; } .page:last-child { page-break-after: auto; } }
.page { width: 210mm; min-height: 297mm; position: relative; overflow: hidden; }

/* Page 1 — Cover */
.cover { background: linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px; }
.cover::before { content: ''; position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: rgba(255,255,255,0.03); }
.cover::after { content: ''; position: absolute; bottom: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: rgba(255,255,255,0.02); }
.cover * { position: relative; z-index: 1; }
.cover .logo-icon { width: 80px; height: 80px; background: ${COLORS.accent}; color: ${COLORS.primaryDark}; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 32px; margin: 0 auto 24px; }
.cover h1 { font-size: 42px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; }
.cover h1 span { color: ${COLORS.accentLight}; }
.cover .positioning { font-size: 14px; text-transform: uppercase; letter-spacing: 4px; color: ${COLORS.accentLight}; margin-bottom: 40px; }
.cover .tagline { font-size: 20px; opacity: 0.85; max-width: 500px; line-height: 1.6; margin: 0 auto 48px; }
.cover .stats { display: flex; gap: 24px; justify-content: center; }
.cover .stat { background: rgba(255,255,255,0.1); border-radius: 14px; padding: 20px 28px; text-align: center; }
.cover .stat-val { font-size: 28px; font-weight: 800; }
.cover .stat-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-top: 4px; }
.cover .contact-bar { position: absolute; bottom: 40px; left: 0; right: 0; text-align: center; font-size: 13px; opacity: 0.7; }

/* Page 2 — Inside */
.inside { background: ${COLORS.cream}; padding: 48px; }
.inside h2 { font-size: 26px; font-weight: 800; color: ${COLORS.primaryDark}; margin-bottom: 8px; }
.inside .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: ${COLORS.accent}; font-weight: 600; margin-bottom: 6px; }
.inside .subtitle { font-size: 14px; color: ${COLORS.textLight}; margin-bottom: 24px; }
.inside .divider { width: 40px; height: 3px; background: ${COLORS.accent}; border-radius: 2px; margin: 32px 0; }

.programs-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 8px; }
.program-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.program-card h4 { font-size: 14px; font-weight: 700; color: ${COLORS.primaryDark}; margin-bottom: 4px; }
.program-card .age { font-size: 11px; color: ${COLORS.accent}; font-weight: 600; margin-bottom: 8px; }
.program-card p { font-size: 11px; color: ${COLORS.textLight}; line-height: 1.5; }

.why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.why-card { background: white; border-radius: 10px; padding: 16px; border-left: 3px solid ${COLORS.primary}; }
.why-card h5 { font-size: 12px; font-weight: 700; color: ${COLORS.primaryDark}; margin-bottom: 4px; }
.why-card p { font-size: 11px; color: ${COLORS.textLight}; line-height: 1.5; }

.cta-bar { background: ${COLORS.primary}; color: white; border-radius: 14px; padding: 28px; text-align: center; margin-top: 32px; }
.cta-bar h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.cta-bar p { font-size: 13px; opacity: 0.8; }
.cta-bar .phone { font-size: 22px; font-weight: 800; color: ${COLORS.accentLight}; margin-top: 12px; }
</style></head>
<body>

<!-- Page 1: Cover -->
<div class="page cover">
  <div class="logo-icon">KP</div>
  <div class="positioning">${SCHOOL.positioning}</div>
  <h1>${SCHOOL.tagline.split("Brightest")[0]}<span>Brightest Future Begins</span></h1>
  <div class="tagline">Founded by ${SCHOOL.founder} in ${SCHOOL.founded}, ${SCHOOL.name} is Kullu Valley's most trusted school for quality education from Playgroup to Class 8.</div>
  <div class="stats">
    <div class="stat"><div class="stat-val">${SCHOOL.years}</div><div class="stat-lbl">Years</div></div>
    <div class="stat"><div class="stat-val">${SCHOOL.classrooms}</div><div class="stat-lbl">Classrooms</div></div>
    <div class="stat"><div class="stat-val">${SCHOOL.ratio}</div><div class="stat-lbl">Ratio</div></div>
    <div class="stat"><div class="stat-val">${SCHOOL.rating}</div><div class="stat-lbl">Rating</div></div>
  </div>
  <div class="contact-bar">${SCHOOL.phone} · ${SCHOOL.email} · ${SCHOOL.website}</div>
</div>

<!-- Page 2: Inside -->
<div class="page inside">
  <div class="section-label">Academics</div>
  <h2>Our Programs</h2>
  <div class="subtitle">Comprehensive education from ages 2 to 14, aligned with HPBOSE curriculum</div>
  <div class="programs-grid">
    <div class="program-card"><h4>Playgroup & Nursery</h4><div class="age">Ages 2–4</div><p>Play-based introduction to learning, creativity, social skills, and motor development.</p></div>
    <div class="program-card"><h4>Kindergarten</h4><div class="age">Ages 4–6</div><p>Structured readiness for school with phonics, number concepts, and hands-on activities.</p></div>
    <div class="program-card"><h4>Primary (1–5)</h4><div class="age">Ages 6–11</div><p>Strong academic foundation with HPBOSE curriculum, art, sports, and computer awareness.</p></div>
    <div class="program-card"><h4>Middle (6–8)</h4><div class="age">Ages 11–14</div><p>Comprehensive academics with Science, Mathematics, English, Hindi, Sanskrit, and Social Studies.</p></div>
    <div class="program-card"><h4>Activities</h4><div class="age">All Ages</div><p>Art & Craft, Music, Dance, Sports, Annual Day, Sports Day, educational excursions.</p></div>
    <div class="program-card"><h4>Values</h4><div class="age">All Ages</div><p>Moral Science, community service, cultural celebrations, and character-building programs.</p></div>
  </div>

  <div class="divider"></div>

  <div class="section-label">The Kids Planet Difference</div>
  <h2>Why Parents Choose Us</h2>
  <div class="subtitle">We don't just teach — we nurture confident, curious learners</div>
  <div class="why-grid">
    <div class="why-card"><h5>Dedicated Preschool Focus</h5><p>Unlike other schools, preschool isn't a side program here — it's our entire mission and expertise.</p></div>
    <div class="why-card"><h5>Founder-Led, Family-Run</h5><p>Mrs. Neeta Parmar personally knows every child and leads with 25+ years of teaching experience.</p></div>
    <div class="why-card"><h5>Small Class Sizes</h5><p>With a 20:1 ratio, every child gets the personal attention they deserve.</p></div>
    <div class="why-card"><h5>Daily Parent Updates</h5><p>Stay connected with your child's day through regular WhatsApp updates and photos.</p></div>
  </div>

  <div class="cta-bar">
    <h3>Reserve Your Child's Seat for 2026–27</h3>
    <p>Limited seats available · Admissions open now</p>
    <div class="phone">${SCHOOL.phone}</div>
  </div>
</div>

</body></html>`;
}

// ─── Generator ─────────────────────────────────────────────────
function generate(type) {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const items = [];

  if (!type || type === "flyer") {
    const file = path.join(outputDir, "flyer-admission.html");
    fs.writeFileSync(file, generateAdmissionFlyer());
    items.push(file);
  }

  if (!type || type === "instagram") {
    for (const variant of ["admission", "whyUs", "testimonial", "seats", "founder"]) {
      const file = path.join(outputDir, `instagram-${variant}.html`);
      fs.writeFileSync(file, generateInstagramAd(variant));
      items.push(file);
    }
  }

  if (!type || type === "story") {
    for (const variant of ["admission", "dayInLife"]) {
      const file = path.join(outputDir, `story-${variant}.html`);
      fs.writeFileSync(file, generateInstagramStory(variant));
      items.push(file);
    }
  }

  if (!type || type === "brochure") {
    const file = path.join(outputDir, "brochure-school.html");
    fs.writeFileSync(file, generateBrochure());
    items.push(file);
  }

  return items;
}

// ─── CLI ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
const typeFlag = args.indexOf("--type");
const type = typeFlag !== -1 ? args[typeFlag + 1] : null;

console.log("\n🪐 Planet Studio — Kids Planet Marketing Generator\n");
console.log("Generating marketing materials...\n");

const files = generate(type);

files.forEach((f) => {
  const name = path.basename(f);
  const size = (fs.statSync(f).size / 1024).toFixed(1);
  console.log(`  ✓ ${name} (${size} KB)`);
});

console.log(`\n📁 Output: ${path.join(__dirname, "output")}`);
console.log("\n💡 How to use:");
console.log("   • Open any HTML file in Chrome/Edge");
console.log("   • For flyers/brochures: Print → Save as PDF");
console.log("   • For Instagram: Screenshot at exact dimensions");
console.log("   • Or use browser DevTools to set device size and screenshot\n");

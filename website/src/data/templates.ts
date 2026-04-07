export interface TemplateField {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "year" | "image" | "color";
  default: string;
  placeholder?: string;
}

export type TemplateCategory = "flyer" | "brochure" | "instagram" | "story" | "whatsapp" | "banner";

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  width: number;
  height: number;
  fields: TemplateField[];
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  flyer: "Flyers",
  brochure: "Brochures",
  instagram: "Instagram Posts",
  story: "Instagram Stories",
  whatsapp: "WhatsApp Creatives",
  banner: "Banners",
};

export const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  flyer: "bg-blue-100 text-blue-700",
  brochure: "bg-purple-100 text-purple-700",
  instagram: "bg-pink-100 text-pink-700",
  story: "bg-amber-100 text-amber-700",
  whatsapp: "bg-green-100 text-green-700",
  banner: "bg-cyan-100 text-cyan-700",
};

export const TEMPLATES: TemplateDefinition[] = [
  // --- Flyers (A4: 794x1123px) ---
  {
    id: "admission-flyer",
    name: "Admission Flyer",
    category: "flyer",
    description: "Print-ready A4 flyer announcing admissions with school info and CTA",
    width: 794,
    height: 1123,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Admissions Open 2026-27" },
      { key: "subheadline", label: "Subheadline", type: "text", default: "Kullu Valley's Dedicated Early Childhood Learning Center" },
      { key: "cta", label: "Call to Action", type: "text", default: "Enroll Now — Limited Seats!" },
      { key: "phone", label: "Contact Number", type: "text", default: "+91 98180 97475" },
      { key: "classes", label: "Classes Offered", type: "text", default: "Playgroup · Nursery · LKG · UKG · Class 1–8" },
      { key: "backgroundImage", label: "Background Image", type: "image", default: "/images/campus/morning-assembly.jpg" },
    ],
  },
  {
    id: "annual-day-flyer",
    name: "Annual Day Flyer",
    category: "flyer",
    description: "Event flyer for the school's annual day celebration",
    width: 794,
    height: 1123,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Annual Day Celebration 2026" },
      { key: "date", label: "Event Date", type: "text", default: "March 30, 2026" },
      { key: "venue", label: "Venue", type: "text", default: "Kids Planet School Campus, Dhalpur" },
      { key: "time", label: "Time", type: "text", default: "10:00 AM Onwards" },
      { key: "cta", label: "Call to Action", type: "text", default: "All Parents Are Cordially Invited" },
    ],
  },
  {
    id: "summer-camp-flyer",
    name: "Summer Camp Flyer",
    category: "flyer",
    description: "Promotional flyer for summer camp activities",
    width: 794,
    height: 1123,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Summer Camp 2026" },
      { key: "dates", label: "Camp Dates", type: "text", default: "May 15 – June 15, 2026" },
      { key: "activities", label: "Activities", type: "text", default: "Art · Dance · Sports · Science Fun · Storytelling" },
      { key: "age", label: "Age Group", type: "text", default: "Ages 3–12 Years" },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
    ],
  },
  {
    id: "open-house-invite",
    name: "Open House Invite",
    category: "flyer",
    description: "Invitation flyer for school open house / visit day",
    width: 794,
    height: 1123,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Open House — Visit Kids Planet!" },
      { key: "date", label: "Date", type: "text", default: "April 5, 2026" },
      { key: "time", label: "Time", type: "text", default: "9:00 AM – 1:00 PM" },
      { key: "cta", label: "Call to Action", type: "text", default: "Come See Where Learning Comes Alive" },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
    ],
  },
  // --- Brochures (A4: 794x1123px, single panel) ---
  {
    id: "school-brochure",
    name: "School Brochure",
    category: "brochure",
    description: "Comprehensive school overview with programs, USPs, and contact info",
    width: 794,
    height: 1123,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Welcome to Kids Planet" },
      { key: "tagline", label: "Tagline", type: "text", default: "Where Every Child Shines" },
      { key: "usps", label: "Key USPs", type: "textarea", default: "• Kullu's Only Dedicated Preschool\n• 20:1 Student-Teacher Ratio\n• Holistic Development Focus\n• Safe, Loving Environment" },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
      { key: "headerImage", label: "Header Image", type: "image", default: "/images/campus/building-exterior.jpg" },
    ],
  },
  {
    id: "fee-structure-card",
    name: "Fee Structure Card",
    category: "brochure",
    description: "Clean fee structure overview for parents",
    width: 794,
    height: 1123,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Fee Structure 2026-27" },
      { key: "year", label: "Academic Year", type: "text", default: "2026-27" },
      { key: "note", label: "Additional Note", type: "text", default: "Fees payable quarterly. Sibling discount available." },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
    ],
  },
  // --- Instagram Posts (1080x1080px) ---
  {
    id: "ig-admissions-open",
    name: "Admissions Open",
    category: "instagram",
    description: "Instagram post announcing admissions for the new session",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Admissions Open 2026-27" },
      { key: "subheadline", label: "Subheadline", type: "text", default: "Playgroup to Class 8" },
      { key: "cta", label: "Call to Action", type: "text", default: "Call Now: +91 98180 97475" },
      { key: "backgroundImage", label: "Background Image", type: "image", default: "/images/campus/building-exterior.jpg" },
    ],
  },
  {
    id: "ig-why-kids-planet",
    name: "Why Kids Planet?",
    category: "instagram",
    description: "Positioning ad — Kullu's only dedicated preschool",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Why Kids Planet?" },
      { key: "reason1", label: "Reason 1", type: "text", default: "Kullu's Only Dedicated Preschool" },
      { key: "reason2", label: "Reason 2", type: "text", default: "20:1 Student-Teacher Ratio" },
      { key: "reason3", label: "Reason 3", type: "text", default: "Holistic Development Approach" },
      { key: "reason4", label: "Reason 4", type: "text", default: "Safe & Nurturing Environment" },
    ],
  },
  {
    id: "ig-parent-reviews",
    name: "Parent Reviews",
    category: "instagram",
    description: "Social proof ad with school rating",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "What Parents Say" },
      { key: "rating", label: "Rating", type: "text", default: "4.4 ★" },
      { key: "review", label: "Featured Review", type: "textarea", default: "\"Best preschool in Kullu Valley. My child loves going to school every day!\"" },
      { key: "reviewer", label: "Reviewer Name", type: "text", default: "— A Happy Parent" },
      { key: "backgroundImage", label: "Background Image", type: "image", default: "" },
    ],
  },
  {
    id: "ig-limited-seats",
    name: "Limited Seats",
    category: "instagram",
    description: "Urgency ad — seats filling fast",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Limited Seats Available!" },
      { key: "subheadline", label: "Subheadline", type: "text", default: "89% Seats Already Filled" },
      { key: "cta", label: "Call to Action", type: "text", default: "Don't Wait — Enroll Today!" },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
    ],
  },
  {
    id: "ig-founder-story",
    name: "Founder Story",
    category: "instagram",
    description: "Emotional ad — A School Built on Love",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "A School Built on Love" },
      { key: "founder", label: "Founder Name", type: "text", default: "Mrs. Neeta Parmar" },
      { key: "quote", label: "Founder Quote", type: "textarea", default: "\"Every child deserves a place where they feel safe, loved, and inspired to learn.\"" },
      { key: "since", label: "Since", type: "text", default: "Est. 2010" },
    ],
  },
  {
    id: "ig-achievement",
    name: "Achievement Spotlight",
    category: "instagram",
    description: "Highlight student or school achievements",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Proud Moment!" },
      { key: "achievement", label: "Achievement", type: "text", default: "Our students shine at the District Science Fair" },
      { key: "detail", label: "Details", type: "text", default: "3 Gold Medals · 5 Participations" },
    ],
  },
  {
    id: "ig-festival",
    name: "Festival Greeting",
    category: "instagram",
    description: "Festival/holiday greeting post",
    width: 1080,
    height: 1080,
    fields: [
      { key: "greeting", label: "Greeting", type: "text", default: "Happy Diwali!" },
      { key: "message", label: "Message", type: "text", default: "Wishing light, joy, and knowledge to all our families" },
      { key: "from", label: "From", type: "text", default: "From the Kids Planet Family" },
    ],
  },
  // --- Instagram Stories (1080x1920px) ---
  {
    id: "story-admission",
    name: "Admission Story",
    category: "story",
    description: "Instagram story for admissions",
    width: 1080,
    height: 1920,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Admissions Open!" },
      { key: "year", label: "Academic Year", type: "text", default: "2026-27" },
      { key: "cta", label: "Swipe Up CTA", type: "text", default: "Swipe Up to Enquire" },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
    ],
  },
  {
    id: "story-day-in-life",
    name: "Day in Life",
    category: "story",
    description: "Show the daily schedule at Kids Planet",
    width: 1080,
    height: 1920,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "A Day at Kids Planet" },
      { key: "schedule", label: "Schedule Highlights", type: "textarea", default: "9:00 AM — Morning Circle\n10:00 AM — Learning Time\n11:00 AM — Outdoor Play\n12:00 PM — Lunch & Story\n1:00 PM — Creative Arts\n2:30 PM — Pack Up & Go Home" },
    ],
  },
  {
    id: "story-new-batch",
    name: "New Batch Announcement",
    category: "story",
    description: "Announce new batch starting",
    width: 1080,
    height: 1920,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "New Batch Starting!" },
      { key: "class", label: "Class", type: "text", default: "Playgroup & Nursery" },
      { key: "date", label: "Start Date", type: "text", default: "April 1, 2026" },
      { key: "cta", label: "CTA", type: "text", default: "Limited Seats — Call Now" },
    ],
  },
  {
    id: "story-event-highlight",
    name: "Event Highlight",
    category: "story",
    description: "Highlight a recent school event",
    width: 1080,
    height: 1920,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "What a Day!" },
      { key: "event", label: "Event Name", type: "text", default: "Annual Sports Day 2026" },
      { key: "highlight", label: "Highlight", type: "text", default: "100+ Students · 15 Events · Endless Fun" },
    ],
  },
  // --- WhatsApp Creatives (1080x1080px) ---
  {
    id: "wa-admission-reply",
    name: "Admission Inquiry Reply",
    category: "whatsapp",
    description: "Professional reply image for admission inquiries on WhatsApp",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Thank You for Your Interest!" },
      { key: "message", label: "Message", type: "textarea", default: "We'd love to welcome your child to the Kids Planet family. Visit us to learn more!" },
      { key: "visitHours", label: "Visit Hours", type: "text", default: "Mon–Sat: 9 AM – 1 PM" },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
    ],
  },
  {
    id: "wa-fee-reminder",
    name: "Fee Reminder",
    category: "whatsapp",
    description: "Gentle fee payment reminder for parents",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Fee Payment Reminder" },
      { key: "quarter", label: "Quarter", type: "text", default: "Q1 (April – June 2026)" },
      { key: "dueDate", label: "Due Date", type: "text", default: "April 15, 2026" },
      { key: "note", label: "Note", type: "text", default: "Pay via UPI, Cash, or Bank Transfer" },
      { key: "phone", label: "Contact", type: "text", default: "+91 98180 97475" },
    ],
  },
  {
    id: "wa-holiday-notice",
    name: "Holiday Notice",
    category: "whatsapp",
    description: "Holiday closure announcement for parents",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Holiday Notice" },
      { key: "occasion", label: "Occasion", type: "text", default: "Holi" },
      { key: "dates", label: "Holiday Dates", type: "text", default: "March 13–14, 2026" },
      { key: "resumeDate", label: "School Resumes", type: "text", default: "March 16, 2026 (Monday)" },
    ],
  },
  {
    id: "wa-event-invite",
    name: "Event Invite",
    category: "whatsapp",
    description: "Event invitation image for WhatsApp broadcast",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "You're Invited!" },
      { key: "event", label: "Event Name", type: "text", default: "Annual Day Celebration" },
      { key: "date", label: "Date & Time", type: "text", default: "March 30, 2026 · 10 AM" },
      { key: "venue", label: "Venue", type: "text", default: "Kids Planet Campus, Dhalpur" },
    ],
  },
  // --- Banners ---
  {
    id: "banner-facebook-cover",
    name: "Facebook Cover",
    category: "banner",
    description: "Facebook page cover photo",
    width: 1200,
    height: 628,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Kids Planet — Where Every Child Shines" },
      { key: "subheadline", label: "Subheadline", type: "text", default: "Kullu Valley's Dedicated Early Childhood Learning Center" },
      { key: "since", label: "Since", type: "text", default: "Est. 2010" },
      { key: "backgroundImage", label: "Background Image", type: "image", default: "/images/campus/morning-assembly.jpg" },
    ],
  },
  {
    id: "banner-website-hero",
    name: "Website Hero Banner",
    category: "banner",
    description: "Hero banner for the school website",
    width: 1200,
    height: 628,
    fields: [
      { key: "headline", label: "Headline", type: "text", default: "Admissions Open for 2026-27" },
      { key: "subheadline", label: "Subheadline", type: "text", default: "Give Your Child the Best Start in Kullu Valley" },
      { key: "cta", label: "CTA Button Text", type: "text", default: "Apply Now" },
      { key: "backgroundImage", label: "Background Image", type: "image", default: "/images/campus/building-exterior.jpg" },
    ],
  },
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  if (id === 'blank') return undefined;
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category?: TemplateCategory): TemplateDefinition[] {
  if (!category) return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}

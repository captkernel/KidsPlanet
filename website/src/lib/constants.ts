export const SCHOOL = {
  name: "Kids Planet",
  tagline: "Nurturing Excellence Since 2010",
  description:
    "Established in 2010 by Mrs. Neeta Parmar, Kids Planet is by far the best preschool for children in Kullu Valley. The children are nurtured with love and care and taught a thoughtfully designed curriculum from Nursery to 8th by experienced mentors.",
  founded: 2010,
  founder: "Mrs. Neeta Parmar",
  founderTitle: "Founder & Principal",
  founderBio:
    "With decades of teaching experience, Mrs. Neeta Parmar founded Kids Planet in 2010 with a vision to provide quality education in the heart of Kullu Valley. Her dedication to nurturing young minds has made Kids Planet the most trusted school in the region. Together with Mr. Ranjeet Parmar, the school has grown from a small playgroup into a full K–8 institution serving over 200 families.",
  address: "Kids Planet School, Guru Behar, Dhalpur, Kullu — 175101",
  phone: "+919418023454",
  phoneDisplay: "+91 94180 23454",
  email: "parmar.ranjeet95@gmail.com",
  whatsapp: "919418023454",
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
    instagram: "https://www.instagram.com/kidsplanet_kullu/",
  },
  mapUrl: "https://maps.app.goo.gl/wPPZwpFfuFCcPHuB9",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3377.5!2d77.1072594!3d31.9536218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390479a3c0f6e0c7%3A0x7e3e98bda7e7b1a4!2sKids%20Planet!5e0!3m2!1sen!2sin!4v1711280000000",
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
  { href: "/daily-life", label: "School Life" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Programs" },
  { href: "/faculty", label: "Our Faculty" },
  { href: "/daily-life", label: "School Life" },
  { href: "/admissions", label: "Admissions" },
  { href: "/achievements", label: "Achievements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/announcements", label: "Announcements" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/PlanetStudio", label: "Planet Studio" },
] as const;

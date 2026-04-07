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

export function getBreadcrumbJsonLd() {
  const baseUrl = "https://kidsplanetkullu.com";
  const pages = [
    { name: "Home", path: "" },
    { name: "About Us", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Admissions", path: "/admissions" },
    { name: "Gallery", path: "/gallery" },
    { name: "Faculty", path: "/faculty" },
    { name: "Achievements", path: "/achievements" },
    { name: "School Life", path: "/daily-life" },
    { name: "Announcements", path: "/announcements" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: pages.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.name,
      item: `${baseUrl}${page.path}`,
    })),
  };
}

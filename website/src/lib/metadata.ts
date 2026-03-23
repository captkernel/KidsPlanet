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

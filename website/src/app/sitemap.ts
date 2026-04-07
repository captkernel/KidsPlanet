import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kidsplanetkullu.com";
  const lastModified = new Date("2026-04-07");

  return [
    { url: baseUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/programs`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/admissions`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/daily-life`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faculty`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/achievements`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/gallery`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/announcements`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}

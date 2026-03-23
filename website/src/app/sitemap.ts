import type { MetadataRoute } from "next";

export const dynamic = "force-static";

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

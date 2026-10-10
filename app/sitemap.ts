import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://all-around-forsyth.vercel.app";

const PAGES = [
  "", "/map", "/parks", "/events", "/top-10", "/civic", "/emergency",
  "/history", "/trip-planner", "/submit-business", "/sources", "/accessibility", "/copyright",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}

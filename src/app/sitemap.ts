import type { MetadataRoute } from "next";
import { wanderRoutes } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return wanderRoutes.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/now" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sobre", "/exames", "/convenios", "/unidades", "/contato", "/resultados"],
      disallow: ["/admin", "/api"],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}

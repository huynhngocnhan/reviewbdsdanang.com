declare const process: {
  env: Record<string, string | undefined>;
};

type ProjectItem = {
  slug?: string;
  updatedAt?: string;
  publishedAt?: string;
};

type VercelRequestLike = {
  headers?: Record<string, string | string[] | undefined>;
};

type VercelResponseLike = {
  status: (code: number) => VercelResponseLike;
  setHeader: (name: string, value: string) => VercelResponseLike;
  send: (body: string) => void;
};

const normalizeApiBase = (base: string) => {
  const trimmed = base.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
};

const formatDate = (input?: string) => {
  if (!input) return new Date().toISOString().slice(0, 10);
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const xmlEscape = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  try {
    // Keep sitemap URLs stable (avoid host/proto variations).
    const siteUrl = (process.env.SITE_URL || "https://www.reviewbdsdanang.com").replace(/\/$/, "");
    const apiBaseRaw = process.env.SEO_API_BASE_URL || process.env.VITE_API_URL || siteUrl;
    const apiBase = normalizeApiBase(apiBaseRaw);

    const pageSize = 100;
    let page = 1;
    let totalPages = 1;
    const projects: ProjectItem[] = [];

    do {
      const response = await fetch(`${apiBase}/projects?status=PUBLISHED&page=${page}&limit=${pageSize}`);
      if (!response.ok) {
        return res.status(response.status).send("Failed to build sitemap");
      }

      const json = await response.json();
      const pageItems: ProjectItem[] = Array.isArray(json?.data) ? json.data : [];
      projects.push(...pageItems);

      const paginationTotalPages = Number(json?.pagination?.totalPages || 1);
      totalPages = Number.isFinite(paginationTotalPages) && paginationTotalPages > 0 ? paginationTotalPages : 1;
      page += 1;
    } while (page <= totalPages);

    const today = new Date().toISOString().slice(0, 10);
    const baseUrls = [
      { loc: `${siteUrl}/`, lastmod: today, changefreq: "daily", priority: "1.0" },
      // Optional hub page (even if SPA) helps discovery/internal linking.
      { loc: `${siteUrl}/du-an`, lastmod: today, changefreq: "daily", priority: "0.8" },
    ];

    const projectUrls = projects
      .filter((p) => p?.slug)
      .map((p) => ({
        loc: `${siteUrl}/du-an/${encodeURIComponent(String(p.slug).trim())}`,
        lastmod: formatDate(p.updatedAt || p.publishedAt),
        changefreq: "weekly",
        priority: "0.9",
      }));

    const urlEntries = [...baseUrls, ...projectUrls]
      .map(
        (u) => `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n    <lastmod>${xmlEscape(u.lastmod)}</lastmod>\n    <changefreq>${xmlEscape(u.changefreq)}</changefreq>\n    <priority>${xmlEscape(u.priority)}</priority>\n  </url>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation error", error);
    return res.status(500).send("Sitemap generation error");
  }
}

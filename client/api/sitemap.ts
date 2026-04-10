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
    const hostHeader = req.headers?.host;
    const host = Array.isArray(hostHeader)
      ? hostHeader[0] || "www.reviewbdsdanang.com"
      : hostHeader || "www.reviewbdsdanang.com";

    const protoHeader = req.headers?.["x-forwarded-proto"];
    const protoRaw = Array.isArray(protoHeader) ? protoHeader[0] || "https" : protoHeader || "https";
    const protocol = protoRaw.split(",")[0];

    const siteUrl = `${protocol}://${host}`;
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

    const baseUrls = [
      { loc: `${siteUrl}/`, lastmod: new Date().toISOString().slice(0, 10), changefreq: "daily", priority: "1.0" },
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

const DEFAULT_TITLE = "Review BĐS Đà Nẵng - Đánh Giá & Tư Vấn Dự Án Bất Động Sản Uy Tín";
const DEFAULT_DESCRIPTION =
  "Trang thông tin đánh giá, review các dự án bất động sản cao cấp tại Đà Nẵng. Tư vấn miễn phí!";

declare const process: {
  env: Record<string, string | undefined>;
};

type ProjectSeoPayload = {
  slug?: string;
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  reasonToBuyTitle?: string;
  coverImage?: string;
  ogImage?: string;
};

type VercelRequestLike = {
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
};

type VercelResponseLike = {
  status: (code: number) => VercelResponseLike;
  setHeader: (name: string, value: string) => VercelResponseLike;
  send: (body: string) => void;
};

const escapeHtml = (input = "") =>
  String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeApiBase = (base: string) => {
  const trimmed = base.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
};

const upsertMetaByName = (html: string, name: string, content: string) => {
  const tag = `<meta name="${name}" content="${escapeHtml(content)}" />`;
  const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*\\/?>(\\s*)`, "i");
  if (regex.test(html)) return html.replace(regex, `${tag}$1`);
  return html.replace("</head>", `  ${tag}\n</head>`);
};

const upsertMetaByProperty = (html: string, property: string, content: string) => {
  const tag = `<meta property="${property}" content="${escapeHtml(content)}" />`;
  const regex = new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["']\\s*\\/?>(\\s*)`, "i");
  if (regex.test(html)) return html.replace(regex, `${tag}$1`);
  return html.replace("</head>", `  ${tag}\n</head>`);
};

const upsertCanonical = (html: string, canonicalUrl: string) => {
  const tag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  const regex = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i;
  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace("</head>", `  ${tag}\n</head>`);
};

/** SERP title: project name + reason section when no manual metaTitle. */
function buildProjectSeoTitle(project: ProjectSeoPayload): string {
  if (project.metaTitle?.trim()) {
    return project.metaTitle.trim();
  }
  const name = project.title?.trim() || DEFAULT_TITLE;
  const reason = project.reasonToBuyTitle?.trim();
  if (reason) {
    return `${name} - ${reason}`;
  }
  return name;
}

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

    const slug = String(req.query?.slug || "").trim();
    if (!slug) {
      return res.status(400).send("Missing slug");
    }

    const apiBaseRaw = process.env.SEO_API_BASE_URL || process.env.VITE_API_URL || siteUrl;
    const apiBase = normalizeApiBase(apiBaseRaw);

    const [indexResponse, projectResponse] = await Promise.all([
      fetch(`${siteUrl}/index.html`, { headers: { "cache-control": "no-cache" } }),
      fetch(`${apiBase}/projects/slug/${encodeURIComponent(slug)}`),
    ]);

    const template = await indexResponse.text();
    if (!projectResponse.ok) {
      return res.status(projectResponse.status).setHeader("Content-Type", "text/html; charset=utf-8").send(template);
    }

    const projectJson = await projectResponse.json();
    const project: ProjectSeoPayload = projectJson?.data || {};

    const title = buildProjectSeoTitle(project);
    const description =
      project.metaDescription || project.shortDescription || project.subtitle || DEFAULT_DESCRIPTION;
    const image = project.ogImage || project.coverImage || `${siteUrl}/og-image.svg`;
    const canonicalSlug = String(project.slug || slug).trim();
    const projectUrl = `${siteUrl}/du-an/${canonicalSlug}`;

    // If requested slug is not canonical slug from DB, issue a permanent redirect.
    // This helps search engines consolidate old/incorrect URLs to the correct one.
    if (canonicalSlug && canonicalSlug !== slug) {
      return res
        .status(301)
        .setHeader("Location", projectUrl)
        .setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=1800")
        .send("");
    }

    let html = template;
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

    html = upsertMetaByName(html, "title", title);
    html = upsertMetaByName(html, "description", description);

    html = upsertMetaByProperty(html, "og:type", "article");
    html = upsertMetaByProperty(html, "og:url", projectUrl);
    html = upsertMetaByProperty(html, "og:title", title);
    html = upsertMetaByProperty(html, "og:description", description);
    html = upsertMetaByProperty(html, "og:image", image);
    html = upsertMetaByProperty(html, "og:image:width", "1200");
    html = upsertMetaByProperty(html, "og:image:height", "630");

    html = upsertMetaByProperty(html, "twitter:card", "summary_large_image");
    html = upsertMetaByProperty(html, "twitter:url", projectUrl);
    html = upsertMetaByProperty(html, "twitter:title", title);
    html = upsertMetaByProperty(html, "twitter:description", description);
    html = upsertMetaByProperty(html, "twitter:image", image);

    html = upsertCanonical(html, projectUrl);

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=1800");
    return res.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(html);
  } catch (error) {
    console.error("SEO function error", error);
    return res.status(500).send("SEO render error");
  }
}

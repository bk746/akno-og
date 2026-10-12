import { readFileSync } from "fs";
import { join } from "path";

const SITE_ROOT = join(process.cwd(), "akno-site 3 copy");

export type AknoPageData = {
  title: string;
  description: string;
  criticalCss: string;
  bodyHtml: string;
};

function rewriteHtml(html: string): string {
  let out = html;
  out = out.replace(/\b(href|src)=["'](?!https?:|\/|#|mailto:|tel:|javascript:)([^"']+)["']/gi, (_, attr, path) => {
    const next = rewritePath(path);
    return `${attr}="${next}"`;
  });
  out = out.replace(/url\(\s*assets\//g, "url(/assets/");
  out = out.replace(/url\(\s*(\.\.\/)+assets\//g, "url(/assets/");
  out = out.replace(/\bsrcset=["']([^"']+)["']/gi, (_, val: string) => {
    const parts = val.split(",").map((part) => {
      const t = part.trim().split(/\s+/);
      if (t[0]) t[0] = rewritePath(t[0]);
      return t.join(" ");
    });
    return `srcset="${parts.join(", ")}"`;
  });
  return out;
}

function rewritePath(path: string): string {
  if (path.startsWith("http") || path.startsWith("/") || path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }

  const hashIdx = path.indexOf("#");
  const queryIdx = path.indexOf("?");
  const cut = [hashIdx, queryIdx].filter((i) => i >= 0).sort((a, b) => a - b)[0];
  const filePart = cut === undefined ? path : path.slice(0, cut);
  const suffix = cut === undefined ? "" : path.slice(cut);

  const normalized = filePart.replace(/^\.\//, "").replace(/^(\.\.\/)+/, "");

  let route: string;
  if (normalized === "index.html" || normalized === "") route = "/";
  else if (normalized.endsWith(".html")) route = "/" + normalized.slice(0, -5);
  else if (normalized.startsWith("assets/")) route = "/" + normalized;
  else route = "/" + normalized;

  route = route.replace(/\/+/g, "/");
  return route + suffix;
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1]?.replace(/&amp;/g, "&").trim() ?? "AKNO";
}

function extractDescription(html: string): string {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  return m?.[1]?.replace(/&amp;/g, "&").trim() ?? "";
}

function extractCriticalCss(html: string): string {
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!m) return "";
  return rewriteHtml(m[1]);
}

function extractBodyHtml(html: string): string {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!m) return "";
  let body = m[1];
  body = body.replace(/<script[^>]*src=["'][^"']*base(\.min)?\.js[^"']*["'][^>]*>\s*<\/script>/gi, "");
  return rewriteHtml(body.trim());
}

export function loadAknoPage(relativeHtmlPath: string): AknoPageData {
  const full = join(SITE_ROOT, relativeHtmlPath);
  const html = readFileSync(full, "utf8");
  return {
    title: extractTitle(html),
    description: extractDescription(html),
    criticalCss: extractCriticalCss(html),
    bodyHtml: extractBodyHtml(html),
  };
}

export const SERVICE_SLUGS = ["site-web", "ui-ux", "seo", "refonte"] as const;
export const REALISATION_SLUGS = [
  "veillee",
  "alric",
  "vauclair",
  "sublimessence",
  "lacets",
] as const;

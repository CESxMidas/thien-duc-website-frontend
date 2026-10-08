export type ArticleTextSegment =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

export type ArticleReference = {
  href: string;
  label: string;
};

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;
const TRAILING_URL_PUNCTUATION = /[),.;:!?]+$/;
const REFERENCE_PREFIX_PATTERN =
  /^(?:link\s+tham\s+khảo|tham\s+khảo|nguồn|source|reference)(?:\s+bài\s+viết)?\s*[:：-]\s*/i;

function plainText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function normalizeUrl(rawUrl: string) {
  const cleanUrl = rawUrl.trim().replace(TRAILING_URL_PUNCTUATION, "");
  const href = cleanUrl.startsWith("www.") ? `https://${cleanUrl}` : cleanUrl;

  try {
    const parsed = new URL(href);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function displayUrl(href: string) {
  try {
    const url = new URL(href);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function splitTextByLinks(text: string): ArticleTextSegment[] {
  const segments: ArticleTextSegment[] = [];
  const matches = [...text.matchAll(URL_PATTERN)];
  let cursor = 0;

  matches.forEach((match) => {
    const rawUrl = match[0];
    const index = match.index ?? cursor;
    const href = normalizeUrl(rawUrl);
    const visibleUrl = rawUrl.replace(TRAILING_URL_PUNCTUATION, "");

    if (index > cursor) {
      segments.push({ type: "text", text: text.slice(cursor, index) });
    }

    if (href) {
      segments.push({ type: "link", text: visibleUrl, href });
    } else {
      segments.push({ type: "text", text: rawUrl });
    }

    cursor = index + visibleUrl.length;
  });

  if (cursor < text.length) {
    segments.push({ type: "text", text: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: "text", text }];
}

function isReferenceParagraph(paragraph: string, urls: string[]) {
  const text = paragraph.trim();
  if (urls.length === 0) return false;

  const normalized = plainText(text);
  if (
    /^(?:link\s+tham\s+khao|tham\s+khao|nguon|source|reference)(?:\s+bai\s+viet)?\s*[:：-]/.test(
      normalized,
    )
  ) {
    return true;
  }

  const withoutUrls = text
    .replace(URL_PATTERN, "")
    .replace(/[()\[\]{}|,.;:!?/\s-]/g, "");

  return withoutUrls.length === 0;
}

function referenceLabel(paragraph: string, href: string) {
  const withoutUrls = paragraph
    .replace(URL_PATTERN, "")
    .replace(REFERENCE_PREFIX_PATTERN, "")
    .trim()
    .replace(/^[-–—:：\s]+|[-–—:：\s]+$/g, "");

  return withoutUrls || displayUrl(href);
}

export function extractArticleReferences(paragraphs: string[]) {
  const articleParagraphs: string[] = [];
  const references: ArticleReference[] = [];
  const seen = new Set<string>();

  paragraphs.forEach((paragraph) => {
    const urls = [...paragraph.matchAll(URL_PATTERN)]
      .map((match) => normalizeUrl(match[0]))
      .filter((url): url is string => Boolean(url));

    if (!isReferenceParagraph(paragraph, urls)) {
      articleParagraphs.push(paragraph);
      return;
    }

    urls.forEach((href) => {
      if (seen.has(href)) return;
      seen.add(href);
      references.push({ href, label: referenceLabel(paragraph, href) });
    });
  });

  return { articleParagraphs, references };
}

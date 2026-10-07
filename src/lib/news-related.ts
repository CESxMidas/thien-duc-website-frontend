import type { NewsPost } from "@/types/content";

export function getNewsDisplayDate(post: NewsPost) {
  return post.eventDate || post.publishedAt || post.createdAt || "";
}

function sortableDateValue(value: string | undefined) {
  if (!value) return 0;
  const timestamp = Date.parse(value.length <= 10 ? `${value}T00:00:00+07:00` : value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function compareNewsByDisplayDate(a: NewsPost, b: NewsPost) {
  const dateDiff =
    sortableDateValue(getNewsDisplayDate(b)) -
    sortableDateValue(getNewsDisplayDate(a));

  if (dateDiff !== 0) return dateDiff;
  return a.slug.localeCompare(b.slug);
}

export function selectRelatedNews(
  posts: NewsPost[],
  currentPost: NewsPost,
  limit = 3,
) {
  const sameCategory = posts
    .filter(
      (post) =>
        post.slug !== currentPost.slug &&
        post.category?.slug &&
        post.category.slug === currentPost.category?.slug,
    )
    .sort(compareNewsByDisplayDate);

  const selected = sameCategory.slice(0, limit);
  const selectedSlugs = new Set(selected.map((post) => post.slug));

  if (selected.length >= limit) return selected;

  const fallback = posts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && !selectedSlugs.has(post.slug),
    )
    .sort(compareNewsByDisplayDate)
    .slice(0, limit - selected.length);

  return [...selected, ...fallback];
}

export function isArticleSubheading(paragraph: string) {
  const text = paragraph.trim();
  if (text.length < 8 || text.length > 120) return false;
  if (/[.!?]$/.test(text)) return false;

  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length < 6) return false;

  const uppercaseLetters = letters.filter(
    (letter) => letter === letter.toUpperCase() && letter !== letter.toLowerCase(),
  );

  return uppercaseLetters.length / letters.length >= 0.72;
}

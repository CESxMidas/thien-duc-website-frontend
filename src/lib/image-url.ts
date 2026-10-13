export const newsImageFallback =
  "/images/news/legacy/tin-tuc-thien-duc-placeholder-01.jpg";

const legacyNewsImageMap: Record<string, string> = {
  "796930583506.jpg":
    "/images/news/2021/le-khoi-cong-fancy-tower-2021-04-07.jpg",
};

function legacyImageFileName(url: URL): string | undefined {
  if (
    !["thienduccons.vn", "www.thienduccons.vn"].includes(url.hostname) ||
    !url.pathname.startsWith("/img_data/images/")
  ) {
    return undefined;
  }

  return url.pathname.split("/").pop();
}

export function resolveNewsImageUrl(
  image: string | null | undefined,
): string {
  if (!image?.trim()) return newsImageFallback;

  try {
    const url = new URL(image);
    const fileName = legacyImageFileName(url);

    if (fileName) {
      return legacyNewsImageMap[fileName] ?? newsImageFallback;
    }
  } catch {
    // Relative URLs are valid site assets and should be returned unchanged.
  }

  return image;
}

export function resolveNewsImageList(
  images: Array<string | null | undefined>,
): string[] {
  const resolved = images.map(resolveNewsImageUrl);
  return Array.from(new Set(resolved.filter(Boolean)));
}

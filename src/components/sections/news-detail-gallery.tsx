import Image from "next/image";

type NewsDetailGalleryProps = {
  images: string[];
  title: string;
  galleryLabel: string;
  imageLabel: string;
};

function uniqueImages(images: string[]) {
  return images.filter(
    (image, index) => image && images.indexOf(image) === index,
  );
}

export function NewsDetailGallery({
  images,
  title,
  galleryLabel,
  imageLabel,
}: NewsDetailGalleryProps) {
  const gallery = uniqueImages(images);
  const mainImage = gallery[0];
  const secondaryImages = gallery.slice(1);
  if (!mainImage) return null;

  if (gallery.length === 1) {
    return (
      <div className="image-reveal relative aspect-video overflow-hidden border border-charcoal/15 bg-surface sm:aspect-[2/1] lg:aspect-[16/9]">
        <Image
          src={mainImage}
          alt={title}
          fill
          preload
          sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1279px) calc(100vw - 33rem), calc(100vw - 37rem)"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <section
      className="min-w-0"
      aria-label={galleryLabel}
    >
      <div className="image-reveal relative aspect-video overflow-hidden border border-charcoal/15 bg-surface sm:aspect-[2/1] lg:aspect-[16/9]">
        <Image
          src={mainImage}
          alt={title}
          fill
          preload
          sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1279px) calc(100vw - 33rem), calc(100vw - 37rem)"
          className="object-cover"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {secondaryImages.map((image, index) => (
          <div
            key={image}
            className="relative aspect-video min-w-0 overflow-hidden border border-charcoal/15 bg-surface"
          >
            <Image
              src={image}
              alt={`${title} — ${imageLabel} ${index + 2}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 16vw, 14vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

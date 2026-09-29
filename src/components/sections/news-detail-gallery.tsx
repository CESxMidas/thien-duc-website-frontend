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
      <section className="reveal-section page-container pb-8 sm:pb-12">
        <div className="image-reveal relative mx-auto aspect-video max-w-6xl overflow-hidden border border-charcoal/15 bg-surface">
          <Image
            src={mainImage}
            alt={title}
            fill
            preload
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-contain"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="reveal-section page-container pb-8 sm:pb-12"
      aria-label={galleryLabel}
    >
      <div className="mx-auto max-w-6xl">
        <div className="image-reveal relative aspect-video overflow-hidden border border-charcoal/15 bg-surface">
          <Image
            src={mainImage}
            alt={title}
            fill
            preload
            sizes="(max-width: 1280px) 100vw, 1152px"
            className="object-contain"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {secondaryImages.map((image, index) => (
            <figure key={image} className="min-w-0">
              <div className="relative aspect-[4/3] overflow-hidden border border-charcoal/15 bg-surface">
                <Image
                  src={image}
                  alt={`${title} — ${imageLabel} ${index + 2}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 384px"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-2 text-xs text-slate">
                {imageLabel} {index + 2}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

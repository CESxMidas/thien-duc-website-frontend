import Image from "next/image";
type NewsDetailGalleryProps = {
  images: string[];
  title: string;
};

function uniqueImages(images: string[]) {
  return images.filter(
    (image, index) => image && images.indexOf(image) === index,
  );
}

export function NewsDetailGallery({ images, title }: NewsDetailGalleryProps) {
  const gallery = uniqueImages(images);
  const mainImage = gallery[0];
  const secondaryImages = gallery.slice(1);
  if (!mainImage) return null;
  if (gallery.length === 1) {
    return (
      <section className="reveal-section page-container pb-6">
        <div className="image-reveal relative aspect-video max-h-140 overflow-hidden border border-black/10 bg-surface">
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
      className="reveal-section page-container pb-6"
      aria-label="Hinh anh bai viet"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <div className="image-reveal relative aspect-[16/10] overflow-hidden border border-black/10 bg-surface lg:min-h-[27rem]">
          <Image
            src={mainImage}
            alt={title}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 68vw"
            className="object-contain"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {secondaryImages.map((image, index) => (
            <div
              key={image}
              className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-surface"
            >
              <Image
                src={image}
                alt={`${title} - anh ${index + 2}`}
                fill
                sizes="(max-width: 1024px) 50vw, 18vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
